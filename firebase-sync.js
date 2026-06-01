// ============================================================
// Firebase Sync Layer für SFL Manager
// Synchronisiert ausgewählte localStorage-Keys mit Firebase
// Realtime Database. Funktioniert weiterhin offline.
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyBqijRXyIrcs9jnwonTDAiqZS6U6hbEXKk",
    authDomain: "sfl-manager.firebaseapp.com",
    databaseURL: "https://sfl-manager-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sfl-manager",
    storageBucket: "sfl-manager.firebasestorage.app",
    messagingSenderId: "263682515445",
    appId: "1:263682515445:web:f40b6c54a9f5caf78f00bc"
};

// Welche localStorage-Keys sollen mit Firebase synchronisiert werden?
const SYNCED_KEYS = {
    'sportplatzBookings': 'bookings',
    'busBookings': 'busBookings',
    'youthCoaches': 'users',
    'deletedFixedSeriesBookings': 'deletedSeries',
    'customSportFields': 'customFields',
    'sfl_chat_messages': 'chat'
};

const SFL = {
    db: null,
    ready: false,
    listeners: {},
    lastEmitted: {},
    snapshotReceived: {},

    init() {
        try {
            if (typeof firebase === 'undefined') {
                console.warn('[SFL] Firebase SDK nicht geladen - Offline-Modus');
                return;
            }
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            this.db = firebase.database();
            this.ready = true;
            console.log('[SFL] Firebase bereit');
            this.attachAllListeners();
        } catch (err) {
            console.error('[SFL] Firebase Init Fehler:', err);
        }
    },

    attachAllListeners() {
        Object.keys(SYNCED_KEYS).forEach((localKey) => {
            const remotePath = SYNCED_KEYS[localKey];
            this.db.ref(remotePath).on('value', (snapshot) => {
                const remoteData = snapshot.val();
                this.snapshotReceived[localKey] = true;

                const isEmpty = remoteData === null ||
                    (Array.isArray(remoteData) && remoteData.length === 0);

                if (isEmpty) {
                    const localRaw = localStorage.getItem(localKey);
                    let localParsed = null;
                    try { localParsed = localRaw ? JSON.parse(localRaw) : null; } catch (e) {}
                    if (Array.isArray(localParsed) && localParsed.length > 0) {
                        console.log('[SFL]', localKey, '- DB leer, aber lokal vorhanden: re-syncen');
                        this.db.ref(remotePath).set(localParsed).catch(err => console.warn(err));
                    } else {
                        console.log('[SFL]', localKey, '- DB leer, lokale Daten beibehalten');
                    }
                    return;
                }

                let newString;
                try {
                    newString = JSON.stringify(remoteData);
                } catch (e) {
                    console.warn('[SFL] JSON-Stringify Fehler:', e);
                    return;
                }

                const localString = localStorage.getItem(localKey);
                if (localString === newString) {
                    return;
                }

                console.log('[SFL]', localKey, '- Daten von Firebase empfangen');
                localStorage.setItem(localKey, newString);
                this.emit(localKey, remoteData);
            }, (err) => {
                console.warn('[SFL] Listener Fehler für', localKey, err);
            });
        });
    },

    save(localKey, data) {
        try {
            localStorage.setItem(localKey, JSON.stringify(data));
        } catch (e) {
            console.warn('[SFL] localStorage Save Fehler:', e);
        }
        if (!this.ready || !SYNCED_KEYS[localKey]) return;
        const remotePath = SYNCED_KEYS[localKey];
        this.db.ref(remotePath).set(data).then(() => {
            console.log('[SFL]', localKey, '- gespeichert nach Firebase');
        }).catch((err) => {
            console.warn('[SFL] Firebase Save Fehler:', err);
        });
    },

    load(localKey, fallback = null) {
        try {
            const raw = localStorage.getItem(localKey);
            if (raw === null) return fallback;
            return JSON.parse(raw);
        } catch (e) {
            return fallback;
        }
    },

    subscribe(localKey, callback) {
        if (!this.listeners[localKey]) this.listeners[localKey] = [];
        this.listeners[localKey].push(callback);

        if (this.lastEmitted[localKey] !== undefined) {
            try { callback(this.lastEmitted[localKey]); }
            catch (e) { console.warn('[SFL] Subscribe-Callback Error:', e); }
        }
    },

    emit(localKey, data) {
        this.lastEmitted[localKey] = data;
        const cbs = this.listeners[localKey] || [];
        cbs.forEach((cb) => {
            try { cb(data); } catch (e) { console.warn('[SFL] Listener Error:', e); }
        });
    }
};

window.SFL = SFL;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SFL.init());
} else {
    SFL.init();
}
