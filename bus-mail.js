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

    function buildAdminMailBody(booking) {
        const dateLabel = formatGermanDate(booking.date);
        const lines = [
            'Neue Bus-Buchung wartet auf Bestätigung in der SFL-App.',
            '',
            `Datum: ${dateLabel}`,
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

    function buildMailtoUrl(booking) {
        const admins = getAdminRecipients();
        const subject = `Bus-Buchung zur Bestätigung: ${booking.team} - ${formatGermanDate(booking.date)}`;
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

    function processPendingNotifications() {
        // mailto: nur beim Speichern einer neuen Buchung
    }

    window.SFLBusMail = {
        isConfigured,
        notifyPendingBusBooking,
        processPendingNotifications,
        buildMailtoUrl,
        getAdminRecipients
    };
})();
