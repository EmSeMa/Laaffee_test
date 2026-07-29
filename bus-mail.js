// Bus-Buchung: Admin per mailto: informieren (kostenlos, kein Abo nötig)
(function () {
    const DEFAULT_ADMIN_EMAIL = 'jugendleitung@sportfreunde-lauffen.de';

    const DEFAULT_CONFIG = {
        enabled: true,
        adminEmails: [DEFAULT_ADMIN_EMAIL]
    };

    function getConfig() {
        return Object.assign({}, DEFAULT_CONFIG, window.SFL_EMAIL_CONFIG || {});
    }

    function isConfigured() {
        return getConfig().enabled !== false;
    }

    function getAppBaseUrl() {
        const cfg = getConfig();
        let base = cfg.appBaseUrl || '';
        if (base) {
            base = base.replace(/\/$/, '');
            if (/\.html$/i.test(base)) {
                base = base.replace(/\/[^/]+\.html$/i, '');
            }
            return base;
        }
        if (typeof location !== 'undefined' && location.origin) {
            return location.origin + location.pathname.replace(/[^/]+$/, '').replace(/\/$/, '');
        }
        return '';
    }

    function getBookingLink() {
        const base = getAppBaseUrl();
        return base ? `${base}/bus-booking.html` : 'bus-booking.html';
    }

    function formatGermanDate(dateStr) {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('de-DE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    }

    function getAdminRecipients() {
        const cfg = getConfig();
        const fromUsers = [];

        try {
            const stored = localStorage.getItem('youthCoaches');
            if (stored) {
                const users = JSON.parse(stored);
                if (Array.isArray(users)) {
                    users.forEach((user) => {
                        if (user && user.role === 'Admin' && user.email) {
                            fromUsers.push(user.email.trim());
                        }
                    });
                }
            }
        } catch (e) { /* ignorieren */ }

        const fallback = Array.isArray(cfg.adminEmails) ? cfg.adminEmails : [DEFAULT_ADMIN_EMAIL];
        const combined = [...fromUsers, ...fallback]
            .map((email) => String(email || '').trim())
            .filter(Boolean);

        const unique = [...new Set(combined)];
        return unique.length ? unique : [DEFAULT_ADMIN_EMAIL];
    }

    function formatBookingDateRange(booking) {
        const endDate = booking.endDate || booking.date;
        if (!endDate || endDate === booking.date) {
            return formatGermanDate(booking.date);
        }
        return `${formatGermanDate(booking.date)} bis ${formatGermanDate(endDate)}`;
    }

    function buildAdminMailBody(booking) {
        const dateLabel = formatBookingDateRange(booking);
        const lines = [
            'Neue Bus-Buchung wartet auf Bestätigung in der SFL-App.',
            '',
            `Zeitraum: ${dateLabel}`,
            `Mannschaft: ${booking.team || '-'}`,
            `Anlass: ${booking.purpose || '-'}`,
            `Ziel: ${booking.destination || '-'}`,
            `Zeit: ${booking.startTime || '-'} - ${booking.endTime || '-'} Uhr`
        ];

        if (booking.driver) {
            lines.push(`Fahrer: ${booking.driver}`);
        }
        if (booking.bookedByName) {
            lines.push(`Gebucht von: ${booking.bookedByName}`);
        }
        if (booking.bookedByEmail) {
            lines.push(`Kontakt: ${booking.bookedByEmail}`);
        }

        lines.push('', `Bitte in der App bestätigen: ${getBookingLink()}`);

        return lines.join('\n');
    }

    function getBookingUserEmail(booking) {
        const direct = (booking && booking.bookedByEmail || '').trim();
        if (direct) return direct;

        const userId = booking && booking.bookedByUserId;
        if (!userId) return '';

        try {
            const stored = localStorage.getItem('youthCoaches');
            if (!stored) return '';
            const users = JSON.parse(stored);
            if (!Array.isArray(users)) return '';
            const user = users.find((u) => u && String(u.id) === String(userId));
            return user && user.email ? String(user.email).trim() : '';
        } catch (e) {
            return '';
        }
    }

    function buildConfirmationMailBody(booking) {
        const dateLabel = formatBookingDateRange(booking);
        const greeting = booking.bookedByName
            ? `Hallo ${booking.bookedByName},`
            : 'Hallo,';

        const lines = [
            greeting,
            '',
            'deine Busreservierung wurde bestätigt.',
            '',
            `Zeitraum: ${dateLabel}`,
            `Mannschaft: ${booking.team || '-'}`,
            `Anlass: ${booking.purpose || '-'}`,
            `Ziel: ${booking.destination || '-'}`,
            `Zeit: ${booking.startTime || '-'} - ${booking.endTime || '-'} Uhr`
        ];

        if (booking.driver) {
            lines.push(`Fahrer: ${booking.driver}`);
        }

        lines.push(
            '',
            'Bei Rückfragen wende dich bitte an die Jugendleitung.',
            '',
            'Sportfreunde Lauffen',
            getBookingLink()
        );

        return lines.join('\n');
    }

    function buildConfirmationMailtoUrl(booking) {
        const userEmail = getBookingUserEmail(booking);
        if (!userEmail) return null;

        const dateLabel = formatBookingDateRange(booking);
        const subject = `Busreservierung bestätigt: ${booking.team || 'Mannschaft'} - ${dateLabel}`;
        const body = buildConfirmationMailBody(booking);

        let mailto = `mailto:${userEmail}`;
        mailto += `?subject=${encodeURIComponent(subject)}`;
        mailto += `&body=${encodeURIComponent(body)}`;

        return mailto;
    }

    function buildMailtoUrl(booking) {
        const admins = getAdminRecipients();
        const dateLabel = formatBookingDateRange(booking);
        const subject = `Bus-Buchung zur Bestätigung: ${booking.team} - ${dateLabel}`;
        const body = buildAdminMailBody(booking);
        const userEmail = (booking.bookedByEmail || '').trim();

        let mailto = `mailto:${admins.join(',')}`;
        mailto += `?subject=${encodeURIComponent(subject)}`;
        mailto += `&body=${encodeURIComponent(body)}`;

        if (userEmail) {
            mailto += `&cc=${encodeURIComponent(userEmail)}`;
        }

        return mailto;
    }

    function openMailtoUrl(mailto) {
        const link = document.createElement('a');
        link.href = mailto;
        link.target = '_self';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        try {
            window.open(mailto, '_self');
        } catch (e) { /* ignorieren */ }
    }

    function openAdminMailto(booking) {
        const mailto = buildMailtoUrl(booking);
        openMailtoUrl(mailto);
        return mailto;
    }

    async function notifyPendingBusBooking(booking, saveCallback) {
        if (!booking || booking.status !== 'pending' || booking.notificationSent) {
            return { sent: false, reason: 'not-applicable' };
        }

        if (!isConfigured()) {
            return { sent: false, reason: 'not-configured' };
        }

        try {
            const mailto = openAdminMailto(booking);
            booking.notificationSent = true;
            if (typeof saveCallback === 'function') {
                saveCallback();
            }
            return { sent: true, method: 'mailto', mailto: mailto };
        } catch (err) {
            console.error('[Bus-Mail] mailto fehlgeschlagen:', err);
            return {
                sent: false,
                reason: 'send-failed',
                mailto: buildMailtoUrl(booking),
                errorText: err.message || String(err)
            };
        }
    }

    async function notifyConfirmedBusBooking(booking) {
        if (!booking || booking.status !== 'confirmed') {
            return { sent: false, reason: 'not-applicable' };
        }

        if (!isConfigured()) {
            return { sent: false, reason: 'not-configured' };
        }

        const userEmail = getBookingUserEmail(booking);
        if (!userEmail) {
            return { sent: false, reason: 'no-email' };
        }

        try {
            const mailto = buildConfirmationMailtoUrl(booking);
            if (!mailto) {
                return { sent: false, reason: 'no-email' };
            }
            openMailtoUrl(mailto);
            return { sent: true, method: 'mailto', mailto: mailto, recipient: userEmail };
        } catch (err) {
            console.error('[Bus-Mail] Bestätigungs-mailto fehlgeschlagen:', err);
            return {
                sent: false,
                reason: 'send-failed',
                mailto: buildConfirmationMailtoUrl(booking),
                errorText: err.message || String(err)
            };
        }
    }

    function processPendingNotifications() {
        // mailto: nur beim Speichern einer neuen Buchung
    }

    window.SFLBusMail = {
        isConfigured,
        notifyPendingBusBooking,
        notifyConfirmedBusBooking,
        processPendingNotifications,
        buildMailtoUrl,
        buildConfirmationMailtoUrl,
        getBookingUserEmail,
        getAdminRecipients
    };
})();
