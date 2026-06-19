// Bus-Buchung: Admin per mailto: informieren (kostenlos, kein Abo nötig)
(function () {
    function getConfig() {
        return window.SFL_EMAIL_CONFIG || {};
    }

    function isConfigured() {
        const cfg = getConfig();
        return !!cfg.enabled;
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

        const fallback = Array.isArray(cfg.adminEmails) ? cfg.adminEmails : [];
        const combined = [...fromUsers, ...fallback]
            .map((email) => String(email || '').trim())
            .filter(Boolean);

        return [...new Set(combined)];
    }

    function buildAdminMailBody(booking) {
        const dateLabel = formatGermanDate(booking.date);
        const lines = [
            'Neue Bus-Buchung wartet auf Bestätigung in der SFL-App.',
            '',
            `Datum: ${dateLabel}`,
            `Mannschaft: ${booking.team || '—'}`,
            `Anlass: ${booking.purpose || '—'}`,
            `Ziel: ${booking.destination || '—'}`,
            `Zeit: ${booking.startTime || '—'} - ${booking.endTime || '—'} Uhr`
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

    function openAdminMailto(booking) {
        const admins = getAdminRecipients();
        if (!admins.length) {
            throw new Error('Keine Admin-E-Mail-Adresse konfiguriert');
        }

        const subject = `Bus-Buchung zur Bestätigung: ${booking.team} – ${formatGermanDate(booking.date)}`;
        const body = buildAdminMailBody(booking);
        const userEmail = (booking.bookedByEmail || '').trim();

        let mailto = `mailto:${admins.join(',')}`;
        mailto += `?subject=${encodeURIComponent(subject)}`;
        mailto += `&body=${encodeURIComponent(body)}`;

        if (userEmail) {
            mailto += `&cc=${encodeURIComponent(userEmail)}`;
        }

        window.location.href = mailto;
    }

    async function notifyPendingBusBooking(booking, saveCallback) {
        if (!booking || booking.status !== 'pending' || booking.notificationSent) {
            return { sent: false, reason: 'not-applicable' };
        }

        if (!isConfigured()) {
            return { sent: false, reason: 'not-configured' };
        }

        try {
            openAdminMailto(booking);
            booking.notificationSent = true;
            if (typeof saveCallback === 'function') {
                saveCallback();
            }
            return { sent: true, method: 'mailto' };
        } catch (err) {
            console.error('[Bus-Mail] mailto fehlgeschlagen:', err);
            return {
                sent: false,
                reason: 'send-failed',
                errorText: err.message || String(err)
            };
        }
    }

    function processPendingNotifications() {
        // mailto: nur beim Speichern einer neuen Buchung – nicht beim Seitenaufruf
    }

    window.SFLBusMail = {
        isConfigured,
        notifyPendingBusBooking,
        processPendingNotifications
    };
})();
