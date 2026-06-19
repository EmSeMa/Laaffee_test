// E-Mail-Konfiguration für Bus-Buchungsbenachrichtigungen (EmailJS).
// Einrichtung: https://www.emailjs.com → Service + 2 Templates anlegen.
window.SFL_EMAIL_CONFIG = {
    // Auf true setzen, sobald EmailJS eingerichtet ist
    enabled: true,

    // Fallback, falls keine Admin-E-Mails in der Benutzerverwaltung hinterlegt sind
    adminEmails: ['jugendleitung@sportfreunde-lauffen.de'],

    // Link zur Bus-Buchungsseite (für Admin-Erinnerung)
    appBaseUrl: 'https://emsema.github.io/Laaffee_test/bus-booking.html',

    emailjs: {
        publicKey: 'GYRUtj9pHcmQvc7dV',
        serviceId: 'service_jdahfka',
        adminTemplateId: 'template_wmpt0ee',
        userTemplateId: 'template_zp5leka'
    }
};
