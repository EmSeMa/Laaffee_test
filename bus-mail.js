// Bus-Buchungs-E-Mails: Admin-Erinnerung + Nutzer-Auftragseingangsbestätigung
(function () {
    function getConfig() {
        return window.SFL_EMAIL_CONFIG || {};
    }

    function isConfigured() {
        const cfg = getConfig();
        const ej = cfg.emailjs || {};
        return !!(cfg.enabled && ej.publicKey && ej.serviceId && ej.adminTemplateId && ej.userTemplateId);
    }

    function getAppBaseUrl() {
        const cfg = getConfig();
        if (cfg.appBaseUrl) return cfg.appBaseUrl.replace(/\/$/, '');
        if (typeof location !== 'undefined' && location.origin) {
            return location.origin + location.pathname.replace(/[^/]+$/, '').replace(/\/$/, '');
        }
        return '';
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

    function buildBookingSummary(booking) {
        const dateLabel = formatGermanDate(booking.date);
        const lines = [
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

        return lines.join('\n');
    }

    function sendEmail(templateId, params) {
        const cfg = getConfig();
        const ej = cfg.emailjs;

        if (typeof emailjs === 'undefined') {
            return Promise.reject(new Error('EmailJS SDK nicht geladen'));
        }

        return emailjs.send(ej.serviceId, templateId, params, ej.publicKey);
    }

    function sendAdminReminder(booking) {
        const admins = getAdminRecipients();
        if (!admins.length) {
            return Promise.reject(new Error('Keine Admin-E-Mail-Adresse konfiguriert'));
        }

        const summary = buildBookingSummary(booking);
        const bookingLink = getAppBaseUrl() ? `${getAppBaseUrl()}/bus-booking.html` : 'bus-booking.html';

        return Promise.all(admins.map((adminEmail) => {
            return sendEmail(getConfig().emailjs.adminTemplateId, {
                to_email: adminEmail,
                subject: `Bus-Buchung zur Bestätigung: ${booking.team} – ${formatGermanDate(booking.date)}`,
                team: booking.team || '',
                date: formatGermanDate(booking.date),
                purpose: booking.purpose || '',
                destination: booking.destination || '',
                driver: booking.driver || '—',
                start_time: booking.startTime || '',
                end_time: booking.endTime || '',
                booked_by_name: booking.bookedByName || 'Unbekannt',
                booked_by_email: booking.bookedByEmail || '—',
                booking_link: bookingLink,
                message: `Neue Bus-Buchung wartet auf deine Bestätigung.\n\n${summary}\n\nBitte in der App unter „Bus-Buchungen“ bestätigen:\n${bookingLink}`
            });
        }));
    }

    function sendUserConfirmation(booking) {
        const userEmail = (booking.bookedByEmail || '').trim();
        if (!userEmail) {
            return Promise.resolve({ skipped: true, reason: 'no-user-email' });
        }

        const summary = buildBookingSummary(booking);

        return sendEmail(getConfig().emailjs.userTemplateId, {
            to_email: userEmail,
            to_name: booking.bookedByName || booking.team || 'Trainer',
            subject: `Auftragseingang: Bus-Buchung ${formatGermanDate(booking.date)}`,
            team: booking.team || '',
            date: formatGermanDate(booking.date),
            purpose: booking.purpose || '',
            destination: booking.destination || '',
            driver: booking.driver || '—',
            start_time: booking.startTime || '',
            end_time: booking.endTime || '',
            message: `Hallo ${booking.bookedByName || 'Trainer'},\n\nvielen Dank! Wir haben deine Bus-Buchungsanfrage erhalten.\nDer Status ist aktuell „Ausstehend“ und wird vom Admin geprüft.\n\n${summary}\n\nDu erhältst eine weitere Nachricht, sobald die Buchung bestätigt wurde.`
        });
    }

    async function notifyPendingBusBooking(booking, saveCallback) {
        if (!booking || booking.status !== 'pending' || booking.notificationSent) {
            return { sent: false, reason: 'not-applicable' };
        }

        if (!isConfigured()) {
            console.warn('[Bus-Mail] E-Mail-Versand nicht konfiguriert (email-config.js)');
            return { sent: false, reason: 'not-configured' };
        }

        booking.notificationSent = true;
        if (typeof saveCallback === 'function') {
            saveCallback();
        }

        try {
            await sendAdminReminder(booking);

            try {
                await sendUserConfirmation(booking);
            } catch (userErr) {
                console.warn('[Bus-Mail] Nutzer-Bestätigung fehlgeschlagen:', userErr);
            }

            console.log('[Bus-Mail] Benachrichtigungen versendet für Buchung', booking.id);
            return { sent: true };
        } catch (err) {
            booking.notificationSent = false;
            if (typeof saveCallback === 'function') {
                saveCallback();
            }
            console.error('[Bus-Mail] Versand fehlgeschlagen:', err);
            return { sent: false, reason: 'send-failed', error: err };
        }
    }

    async function processPendingNotifications(bookings, saveCallback) {
        if (!Array.isArray(bookings) || !isConfigured()) return;

        const pending = bookings.filter((booking) =>
            booking &&
            booking.status === 'pending' &&
            !booking.notificationSent
        );

        for (const booking of pending) {
            await notifyPendingBusBooking(booking, saveCallback);
        }
    }

    window.SFLBusMail = {
        isConfigured,
        notifyPendingBusBooking,
        processPendingNotifications
    };
})();
