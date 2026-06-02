// Zentrale Firebase-Konfiguration für alle Seiten.
// Wird sowohl von auth-gate.js als auch firebase-sync.js verwendet.
window.SFL_FIREBASE_CONFIG = {
    apiKey: "AIzaSyBqijRXyIrcs9jnwonTDAiqZS6U6hbEXKk",
    authDomain: "sfl-manager.firebaseapp.com",
    databaseURL: "https://sfl-manager-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sfl-manager",
    storageBucket: "sfl-manager.firebasestorage.app",
    messagingSenderId: "263682515445",
    appId: "1:263682515445:web:f40b6c54a9f5caf78f00bc"
};

// Fester Vereins-Account, mit dem sich alle Nutzer im Hintergrund anmelden.
// Der Nutzer gibt nur das Passwort ein - die E-Mail wird intern verwendet.
// Diese E-Mail muss in der Firebase Authentication als User existieren.
window.SFL_LOGIN_EMAIL = 'verein@sfl-lauffen.de';
