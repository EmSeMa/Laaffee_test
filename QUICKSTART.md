# Ulrichsheide Manager – Schnellstart

## Was ist das?

Eine **Progressive Web App (PWA)** für die Sportfreunde Lauffen:

- Sportplatz-Buchungen und feste Trainingszeiten
- Busreservierung
- Trainer- und Benutzerverwaltung
- Echtzeit-Sync über Firebase

## Voraussetzungen

- Firebase-Projekt **sfl-manager** (bereits konfiguriert in `firebase-config.js`)
- Vereins-Account in Firebase Authentication (`verein@sfl-lauffen.de`)
- Optional: lokaler Webserver oder Deployment (GitHub Pages, Firebase Hosting)

## Quick Start

1. **App öffnen** – z. B. `index.html` über einen Webserver (nicht nur `file://`, damit PWA und Service Worker funktionieren).

2. **Vereinspasswort eingeben** – Login-Maske erscheint automatisch.

3. **Trainer-Code** – Auf Seiten wie Buchung oder Benutzerverwaltung mit persönlichem Code anmelden.

4. **PWA installieren** – Im Browser „Zum Startbildschirm hinzufügen“ (Details in `PWA-ANLEITUNG.md`).

## Wichtige Dateien

| Datei | Zweck |
|---|---|
| `firebase-config.js` | Firebase-Projekt & Login-E-Mail |
| `auth-gate.js` | Vereins-Login (Passwort) |
| `firebase-sync.js` | Daten-Sync mit Realtime Database |
| `sw.js` | Offline-Cache |

## Häufige Probleme

**Login schlägt fehl**
- Passwort in Firebase Auth prüfen
- E-Mail in `firebase-config.js` muss zum Firebase-User passen

**Keine Sync-Daten**
- Internetverbindung prüfen
- Firebase Realtime Database Regeln prüfen (siehe `PWA-ANLEITUNG.md`)

**App offline ohne Cache**
- Seite einmal online laden, damit der Service Worker Assets cacht

## Weitere Hilfe

- [PWA-ANLEITUNG.md](./PWA-ANLEITUNG.md)
- [SICHERHEIT-FIREBASE-AUTH.md](./SICHERHEIT-FIREBASE-AUTH.md)
- [README.md](./README.md)
