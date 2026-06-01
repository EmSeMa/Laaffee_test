// PWA Service Worker Registrierung - in alle Seiten einbinden
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('[PWA] Service Worker registriert'))
            .catch(err => console.warn('[PWA] Service Worker Fehler:', err));
    });
}

// "App installieren" Button (optional)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('pwaInstallBtn');
    if (installBtn) {
        installBtn.style.display = 'inline-block';
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            deferredPrompt = null;
            installBtn.style.display = 'none';
        });
    }
});

window.addEventListener('appinstalled', () => {
    console.log('[PWA] App wurde installiert');
});
