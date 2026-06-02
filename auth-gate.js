// ============================================================
// Auth-Gate für SFL Manager
// Legt eine Login-Maske über jede Seite, bis sich der Nutzer
// mit dem zentralen Vereins-Account (E-Mail + Passwort) einloggt.
//
// Firebase muss vor diesem Script geladen sein (firebase-app, firebase-auth)
// und firebase-config.js muss window.SFL_FIREBASE_CONFIG gesetzt haben.
// ============================================================

(function () {
    if (typeof firebase === 'undefined') {
        console.error('[Auth-Gate] Firebase SDK nicht geladen. Anmeldung wird übersprungen.');
        return;
    }
    if (!window.SFL_FIREBASE_CONFIG) {
        console.error('[Auth-Gate] firebase-config.js fehlt. Anmeldung kann nicht starten.');
        return;
    }

    if (!firebase.apps.length) {
        firebase.initializeApp(window.SFL_FIREBASE_CONFIG);
    }

    var auth = firebase.auth();

    try {
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    } catch (e) { /* ignorieren */ }

    // Marker, dass dieser Browser schon mal erfolgreich angemeldet war.
    // Damit erscheint das Overlay nicht bei jedem Seitenwechsel kurz auf.
    var AUTHED_FLAG = 'sfl_authed_once';
    var wasAuthedBefore = false;
    try { wasAuthedBefore = localStorage.getItem(AUTHED_FLAG) === '1'; } catch (e) {}

    // ----------------------------------------
    // Sofort Overlay einblenden (vor erstem Frame)
    // ----------------------------------------
    var STYLE_ID = 'sfl-auth-gate-style';
    if (!document.getElementById(STYLE_ID)) {
        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            #sfl-auth-gate {
                position: fixed;
                inset: 0;
                z-index: 2147483647;
                background: linear-gradient(135deg, #000000 0%, #1f1f1f 100%);
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1.5rem;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            #sfl-auth-gate.is-hidden { display: none !important; }
            .sfl-auth-card {
                background: #ffffff;
                color: #111;
                width: 100%;
                max-width: 420px;
                padding: 2rem 1.75rem;
                border-radius: 14px;
                box-shadow: 0 25px 60px rgba(0,0,0,0.45);
            }
            .sfl-auth-card h2 {
                font-size: 1.4rem;
                margin: 0 0 0.4rem 0;
                color: #000;
            }
            .sfl-auth-card p.sfl-auth-sub {
                color: #555;
                font-size: 0.92rem;
                margin: 0 0 1.25rem 0;
            }
            .sfl-auth-card label {
                display: block;
                font-size: 0.85rem;
                font-weight: 600;
                color: #333;
                margin-bottom: 0.35rem;
            }
            .sfl-auth-card input {
                width: 100%;
                padding: 0.7rem 0.85rem;
                font-size: 1rem;
                border: 1px solid #d5d5d5;
                border-radius: 8px;
                margin-bottom: 0.9rem;
                box-sizing: border-box;
            }
            .sfl-auth-card input:focus {
                outline: none;
                border-color: #000;
                box-shadow: 0 0 0 3px rgba(0,0,0,0.08);
            }
            .sfl-auth-card button {
                width: 100%;
                padding: 0.8rem 1rem;
                font-size: 1rem;
                font-weight: 700;
                color: #fff;
                background: #000;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                margin-top: 0.4rem;
            }
            .sfl-auth-card button:hover { background: #1f1f1f; }
            .sfl-auth-card button:disabled { opacity: 0.6; cursor: not-allowed; }
            .sfl-auth-error {
                background: #fdecea;
                color: #c0392b;
                padding: 0.6rem 0.8rem;
                border-radius: 6px;
                font-size: 0.88rem;
                margin-bottom: 0.9rem;
                display: none;
            }
            .sfl-auth-error.visible { display: block; }
            .sfl-auth-foot {
                margin-top: 1rem;
                font-size: 0.78rem;
                color: #777;
                text-align: center;
                line-height: 1.45;
            }
            .sfl-auth-logo {
                display: block;
                margin: 0 auto 1rem auto;
                max-width: 90px;
                max-height: 90px;
            }
        `;
        document.head.appendChild(style);
    }

    function buildOverlay() {
        var overlay = document.createElement('div');
        overlay.id = 'sfl-auth-gate';
        overlay.innerHTML = `
            <form class="sfl-auth-card" autocomplete="off">
                <img src="assets/logo.png" alt="SFL" class="sfl-auth-logo" onerror="this.style.display='none'">
                <h2>🔒 Geschützter Bereich</h2>
                <p class="sfl-auth-sub">Bitte Vereinspasswort eingeben.</p>
                <div class="sfl-auth-error" id="sfl-auth-error"></div>
                <label for="sfl-auth-password">Vereinspasswort</label>
                <input type="password" id="sfl-auth-password" autocomplete="current-password" required autofocus>
                <button type="submit" id="sfl-auth-submit">Anmelden</button>
                <div class="sfl-auth-foot">
                    Nur für berechtigte Personen der Sportfreunde Lauffen.<br>
                    Bei Fragen wende dich an die Jugendleitung.
                </div>
            </form>
        `;
        return overlay;
    }

    var overlay = null;
    var formEl = null;
    var errorEl = null;
    var submitBtn = null;
    var passwordEl = null;

    function ensureOverlay() {
        if (overlay && document.body.contains(overlay)) return;
        if (!document.body) {
            document.addEventListener('DOMContentLoaded', ensureOverlay);
            return;
        }
        overlay = buildOverlay();
        // Falls bereits einmal erfolgreich eingeloggt: Overlay sofort versteckt
        // einhängen, damit es nicht zwischen Seitenwechseln kurz aufflackert.
        if (wasAuthedBefore) overlay.classList.add('is-hidden');
        document.body.appendChild(overlay);
        formEl = overlay.querySelector('form');
        errorEl = overlay.querySelector('#sfl-auth-error');
        submitBtn = overlay.querySelector('#sfl-auth-submit');
        passwordEl = overlay.querySelector('#sfl-auth-password');

        formEl.addEventListener('submit', function (e) {
            e.preventDefault();
            doLogin();
        });
    }

    function showError(msg) {
        if (!errorEl) return;
        errorEl.textContent = msg;
        errorEl.classList.add('visible');
    }

    function clearError() {
        if (!errorEl) return;
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
    }

    function setLoading(isLoading) {
        if (!submitBtn) return;
        submitBtn.disabled = isLoading;
        submitBtn.textContent = isLoading ? 'Anmelden …' : 'Anmelden';
    }

    function doLogin() {
        clearError();
        var pw = passwordEl.value || '';
        if (!pw) {
            showError('Bitte das Vereinspasswort eingeben.');
            return;
        }
        var email = window.SFL_LOGIN_EMAIL;
        if (!email) {
            showError('Konfigurationsfehler: Login-E-Mail fehlt.');
            return;
        }
        setLoading(true);
        auth.signInWithEmailAndPassword(email, pw)
            .then(function () {
                setLoading(false);
                // onAuthStateChanged kümmert sich um das Ausblenden
            })
            .catch(function (err) {
                setLoading(false);
                console.warn('[Auth-Gate] Login fehlgeschlagen:', err && err.code);
                var msg = 'Falsches Passwort.';
                if (err && err.code) {
                    if (err.code === 'auth/user-not-found') {
                        msg = 'Vereinsaccount nicht eingerichtet. Bitte Admin kontaktieren.';
                    } else if (err.code === 'auth/too-many-requests') {
                        msg = 'Zu viele Fehlversuche. Bitte später erneut versuchen.';
                    } else if (err.code === 'auth/network-request-failed') {
                        msg = 'Keine Internetverbindung.';
                    }
                }
                showError(msg);
                passwordEl.value = '';
                passwordEl.focus();
            });
    }

    function hideOverlay() {
        if (overlay) overlay.classList.add('is-hidden');
    }

    function showOverlay() {
        ensureOverlay();
        if (overlay) overlay.classList.remove('is-hidden');
    }

    ensureOverlay();

    // ----------------------------------------
    // Auth-State beobachten
    // ----------------------------------------
    var authReady = false;
    auth.onAuthStateChanged(function (user) {
        authReady = true;
        if (user) {
            try { localStorage.setItem(AUTHED_FLAG, '1'); } catch (e) {}
            wasAuthedBefore = true;
            hideOverlay();
            window.SFL_AUTH_USER = user;
            document.dispatchEvent(new CustomEvent('sfl-auth-ready', { detail: { user: user } }));
        } else {
            try { localStorage.removeItem(AUTHED_FLAG); } catch (e) {}
            wasAuthedBefore = false;
            window.SFL_AUTH_USER = null;
            showOverlay();
            document.dispatchEvent(new CustomEvent('sfl-auth-logout'));
        }
    });

    // ----------------------------------------
    // Logout-Funktion global verfügbar machen
    // ----------------------------------------
    window.SFLAuth = {
        logout: function () {
            return auth.signOut();
        },
        currentUser: function () {
            return auth.currentUser;
        },
        isReady: function () { return authReady; }
    };
})();
