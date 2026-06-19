(function () {
    if (document.querySelector('.footer, .sfl-site-footer')) {
        return;
    }

    var footer = document.createElement('footer');
    footer.className = 'sfl-site-footer';
    footer.innerHTML =
        '<div class="sfl-site-footer-brand">' +
            '<img src="assets/SFLlogo.png" alt="SFL Logo" class="sfl-site-footer-logo" onerror="this.onerror=null;this.src=\'assets/logo.png\';">' +
            '<p class="sfl-site-footer-title">Ulrichsheide Manager</p>' +
        '</div>' +
        '<p>&copy; 2026 Sportfreunde Lauffen &ndash; Ulrichsheide Manager</p>' +
        '<p class="sfl-site-footer-creator">Erstellt von Emanuel Massa</p>' +
        '<p><a href="index.html">Zur Startseite</a></p>';

    document.body.appendChild(footer);
})();
