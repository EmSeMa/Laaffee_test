# 🏃 Sportplatz Manager - Schnellstart Guide

## 📋 Was ist das?

Eine **vollständige Mobile-App + Backend** für die Verwaltung von Sportplätzen!

Die App ermöglicht:
- 📅 Sportplatz-Buchungen verwalten
- 🔧 Wartungsaufgaben planen
- ⚽ Verfügbare Felder anschauen
- 👤 Benutzerprofil verwalten

## 🎯 Was brauchst du?

**Installiert sein muss:**
- Node.js 16+ ([Download](https://nodejs.org/))
- PostgreSQL 12+ ([Download](https://www.postgresql.org/))

**Optional (für Mobile-Testing):**
- Android Studio (für Android Emulator)
- Xcode (für iOS Simulator auf Mac)
- Expo App (auf Physical Device)

## 🚀 Quick Start (5 Minuten)

### 1. Backend starten

```bash
# Terminal 1:
cd sportplatz-app/backend
npm install
npm run dev
```

Der Server läuft jetzt auf: **http://localhost:5000**

### 2. Datenbank initialisieren

```bash
# Terminal 2:
cd sportplatz-app/backend
createdb sportplatz_db
psql sportplatz_db < database.sql
```

### 3. Mobile App starten

```bash
# Terminal 3:
cd sportplatz-app/mobile
npm install
npm start
```

Dann drücken:
- `i` für iOS Simulator
- `a` für Android Emulator
- `w` für Web Browser
- Oder QR-Code mit Expo App scannen

## 📁 Projektstruktur Quick Ref

```
sportplatz-app/
├── backend/          ← Node.js API Server
│   └── 📖 README.md  ← Backend Doku
├── mobile/           ← React Native App
│   └── 📖 README.md  ← Mobile Doku
└── README.md         ← Hauptdokumentation
```

## 🔐 Test Daten

Nach dem Setup kannst du diese Testdaten verwenden:

**Login:**
- Email: `test@example.com`
- Password: `password123`

**Oder einen neuen Benutzer registrieren!**

## 📚 Weitere Dokumentation

- [Backend README](./backend/README.md) - API Dokumentation
- [Mobile README](./mobile/README.md) - App Dokumentation
- [Sportplatzverwaltungsplan](../Sportplatzverwaltungsplan.md) - Administrativer Plan

## 🛠️ Häufige Probleme

**Fehler: "Cannot find module 'express'"**
```bash
cd backend && npm install
```

**Fehler: "Database connection failed"**
- Prüfe ob PostgreSQL läuft: `pg_isready`
- Überprüfe .env Einstellungen

**App zeigt blank screen**
- Expo Server läuft noch? (`npm start`)
- Correct API URL in `mobile/src/services/api.js`?

## 💡 Nächste Schritte

1. ✅ Backend testen: `curl http://localhost:5000/health`
2. ✅ Ein Konto registrieren in der Mobile App
3. ✅ Eine Buchung erstellen
4. ✅ Eine Wartungsaufgabe hinzufügen
5. 🚀 App für iOS/Android bauen (siehe Deployment Docs)

## 📞 Support

Fragen? Schau in die README-Dateien der jeweiligen Komponenten!

---

**Version:** 1.0.0  
**Letztes Update:** 28.05.2026  
**Entwickler:** DeineTeam
