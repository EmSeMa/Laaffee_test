// E-Mail-Konfiguration für Bus-Buchungsbenachrichtigungen (EmailJS).
// Einrichtung: https://www.emailjs.com → Service + 2 Templates anlegen.
window.SFL_EMAIL_CONFIG = {
    // Auf true setzen, sobald EmailJS eingerichtet ist
    enabled: true,

    // Fallback, falls keine Admin-E-Mails in der Benutzerverwaltung hinterlegt sind
    adminEmails: ['jugendleitung@sportfreunde-lauffen.de'],

    // Link zur Bus-Buchungsseite (für Admin-Erinnerung)
    appBaseUrl: '',

    emailjs: {
        publicKey: '',
        serviceId: '',
        adminTemplateId: '',
        userTemplateId: ''
    }
};
