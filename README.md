# Sportplatz Manager - Mobile App & Backend

Eine vollständige Mobile-App und Backend für die Verwaltung von Sportplätzen mit Buchungen, Wartungsplanung und Feldverwaltung.

## 🎯 Funktionen

### Mobile App (React Native)
- ✅ Benutzerregistrierung und Anmeldung
- ✅ Sportplatz-Buchungen verwalten
- ✅ Wartungsaufgaben und Inspektionen
- ✅ Verfügbare Felder anzeigen
- ✅ Benutzerprofil
- ✅ Echtzeit-Benachrichtigungen

### Backend (Node.js/Express)
- ✅ RESTful API für alle Operationen
- ✅ Benutzer-Authentifizierung (JWT)
- ✅ PostgreSQL Datenbank
- ✅ CORS-Unterstützung
- ✅ Fehlerbehandlung

## 📁 Projektstruktur

```
sportplatz-app/
├── backend/
│   ├── routes/          # API Routes
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   ├── maintenance.js
│   │   └── fields.js
│   ├── middleware/      # Express Middleware
│   │   └── auth.js
│   ├── controllers/     # Business Logic
│   ├── models/          # Data Models
│   ├── server.js        # Main Server
│   ├── database.sql     # Database Init
│   ├── package.json
│   └── .env
│
└── mobile/
    ├── src/
    │   ├── screens/     # App Screens
    │   │   ├── LoginScreen.js
    │   │   ├── RegisterScreen.js
    │   │   ├── BookingsScreen.js
    │   │   ├── MaintenanceScreen.js
    │   │   ├── FieldsScreen.js
    │   │   └── ProfileScreen.js
    │   ├── components/  # Reusable Components
    │   ├── services/    # API Services
    │   │   └── api.js
    │   └── store/       # State Management (Zustand)
    │       └── authStore.js
    ├── App.js           # Main App Component
    ├── app.json         # Expo Config
    ├── package.json
    └── README.md
```

## 🚀 Installation

### Voraussetzungen
- Node.js 16+
- PostgreSQL 12+
- Expo CLI
- Android Studio oder Xcode (für iOS)

### Backend Setup

1. **Dependencies installieren:**
```bash
cd backend
npm install
```

2. **PostgreSQL Datenbank erstellen:**
```bash
createdb sportplatz_db
psql sportplatz_db < database.sql
```

3. **.env Datei konfigurieren:**
```bash
cp .env.example .env
# Bearbeite .env mit deinen Einstellungen
```

4. **Server starten:**
```bash
npm run dev  # Mit Nodemon für Auto-Reload
# oder
npm start    # Produktionsmodus
```

Der Server läuft unter: `http://localhost:5000`

### Mobile App Setup

1. **Dependencies installieren:**
```bash
cd mobile
npm install
```

2. **App starten:**
```bash
npm start      # Expo Dev Server
npm run ios    # iOS Simulator
npm run android # Android Emulator
npm run web    # Web Browser
```

## 🔐 Authentifizierung

Die App verwendet JWT (JSON Web Tokens) für die Authentifizierung.

**Login:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Register:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "Jane Doe"
}
```

## 📚 API Endpoints

### Buchungen
- `GET /api/bookings` - Alle Buchungen abrufen
- `GET /api/bookings/:id` - Buchung abrufen
- `POST /api/bookings` - Neue Buchung erstellen
- `PUT /api/bookings/:id` - Buchung aktualisieren
- `DELETE /api/bookings/:id` - Buchung löschen

### Wartung
- `GET /api/maintenance` - Alle Aufgaben abrufen
- `GET /api/maintenance/:id` - Aufgabe abrufen
- `POST /api/maintenance` - Neue Aufgabe erstellen
- `PUT /api/maintenance/:id` - Aufgabe aktualisieren
- `DELETE /api/maintenance/:id` - Aufgabe löschen

### Felder
- `GET /api/fields` - Alle Felder abrufen
- `GET /api/fields/:id` - Feld abrufen
- `POST /api/fields` - Neues Feld erstellen
- `PUT /api/fields/:id` - Feld aktualisieren
- `DELETE /api/fields/:id` - Feld löschen

## 🗄️ Datenbankschema

### Users Table
- `id` - PRIMARY KEY
- `email` - UNIQUE
- `password` - Hashed
- `name`
- `role` - 'user' or 'admin'
- `is_active` - BOOLEAN
- Timestamps

### Fields Table
- `id` - PRIMARY KEY
- `name`
- `type` - 'football', 'tennis', 'basketball'
- `location`
- `price_per_hour`
- `capacity`
- `is_available` - BOOLEAN
- Timestamps

### Bookings Table
- `id` - PRIMARY KEY
- `field_id` - FOREIGN KEY
- `user_id` - FOREIGN KEY
- `booking_date`
- `start_time` / `end_time`
- `total_price`
- `status` - 'pending', 'confirmed', 'cancelled'
- Timestamps

### Maintenance Tasks Table
- `id` - PRIMARY KEY
- `title`
- `description`
- `field_id` - FOREIGN KEY
- `task_type` - 'cleaning', 'repair', 'inspection'
- `scheduled_date`
- `priority` - 'low', 'medium', 'high'
- `assigned_to` - FOREIGN KEY
- `status` - 'pending', 'in_progress', 'completed'
- `completed_date`
- Timestamps

## 🎨 UI/UX

### Verwendet Libraries
- **react-native-paper** - Material Design Komponenten
- **react-native-vector-icons** - Icons
- **@react-navigation** - Navigation
- **zustand** - State Management
- **axios** - HTTP Client
- **date-fns** - Datumsformatierung

## 🔧 Konfiguration

### Backend Environment Variablen
```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sportplatz_db
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Mobile API URL
Die API URL ist in `src/services/api.js` konfiguriert:
```javascript
const API_URL = 'http://localhost:5000/api';
```

Für Produktionsumgebung:
```javascript
const API_URL = 'https://api.sportplatz-manager.de/api';
```

## 📱 App-Navigation

```
AuthStack (vor Login)
├── Login
└── Register

AppTabs (nach Login)
├── Bookings (Buchungen)
├── Fields (Plätze)
├── Maintenance (Wartung)
└── Profile (Profil)
```

## 🧪 Testing

Backend Tests:
```bash
cd backend
npm test
```

Mobile Tests:
```bash
cd mobile
npm test
```

## 🚀 Deployment

### Backend Deploy (Heroku, Render, AWS)
1. .git repo initialisieren
2. `Procfile` erstellen
3. Umgebungsvariablen setzen
4. Push zu Deployment Service

### Mobile Build

**iOS Build:**
```bash
cd mobile
expo build:ios
```

**Android Build:**
```bash
cd mobile
expo build:android
```

## 📝 Lizenz

MIT License - siehe LICENSE Datei

## 👥 Support

Bei Fragen oder Problemen bitte hier ein Issue erstellen.

---

**Version:** 1.0.0  
**Letzte Aktualisierung:** 28.05.2026
