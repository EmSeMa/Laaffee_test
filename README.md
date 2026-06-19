# Ulrichsheide Manager – Sportfreunde Lauffen

Web-App (PWA) zur Verwaltung von Sportplatz-Buchungen, Busreservierungen, Trainern und Feldern der Sportfreunde Lauffen.

## Funktionen

- Trainingszeiten buchen (`booking-calendar.html`)
- Busreservierung (`bus-booking.html`)
- Feld- und Trainingsübersicht (`fields.html`)
- Benutzerverwaltung mit Trainer-Codes (`users.html`)
- Analytics & Berichte – nur Admins (`analytics.html`)
- Startseite mit Ansprechpartnern und Downloads (`index.html`)

## Technik

- **Frontend:** HTML, CSS, JavaScript (statische Seiten)
- **Auth:** Firebase Authentication (`auth-gate.js`) – Vereinspasswort
- **Sync:** Firebase Realtime Database (`firebase-sync.js`)
- **Offline:** Service Worker (`sw.js`) + `offline.html`
- **PWA:** installierbar auf Handy/Desktop

## Projektstruktur

```
sportplatz-app/
├── index.html
├── booking-calendar.html
├── bus-booking.html
├── fields.html
├── users.html
├── analytics.html
├── auth-gate.js
├── firebase-config.js
├── firebase-sync.js
├── bus-mail.js
├── email-config.js
├── sw.js
├── pwa-register.js
├── manifest.webmanifest
├── assets/
├── PWA-ANLEITUNG.md
└── SICHERHEIT-FIREBASE-AUTH.md
```

## Firebase Sync-Pfade

| localStorage | Firebase |
|---|---|
| `sportplatzBookings` | `/bookings` |
| `busBookings` | `/busBookings` |
| `youthCoaches` | `/users` |
| `deletedFixedSeriesBookings` | `/deletedSeries` |
| `customSportFields` | `/customFields` |

## Lokale Entwicklung

1. Dateien in einem lokalen Webserver öffnen (z. B. Live Server in VS Code) oder auf GitHub Pages / Firebase Hosting deployen.
2. `firebase-config.js` und Firebase Auth müssen eingerichtet sein (siehe `SICHERHEIT-FIREBASE-AUTH.md`).
3. Nach dem Vereins-Login synchronisieren sich die Daten automatisch.

## Weitere Dokumentation

- [PWA-ANLEITUNG.md](./PWA-ANLEITUNG.md) – Installation, Icons, Firebase
- [SICHERHEIT-FIREBASE-AUTH.md](./SICHERHEIT-FIREBASE-AUTH.md) – Login & Sicherheit

---

**Sportfreunde Lauffen** · Ulrichsheide Manager
