// E-Mail-Benachrichtigung für Bus-Buchungen (kostenlos, ohne EmailJS).
// Öffnet nach einer Buchung das E-Mail-Programm mit vorausgefüllter Nachricht an den Admin.
window.SFL_EMAIL_CONFIG = {
    enabled: true,

    // Fallback, falls keine Admin-E-Mails in der Benutzerverwaltung hinterlegt sind
    adminEmails: ['jugendleitung@sportfreunde-lauffen.de'],

    // Basis-URL der App (Ordner, ohne bus-booking.html)
    appBaseUrl: 'https://emsema.github.io/Laaffee_test'
};
