# Mobile App Dokumentation

## Übersicht

Die Sportplatz Manager Mobile App ist eine plattformübergreifende Anwendung (iOS, Android, Web) für die Verwaltung von Sportplatz-Buchungen und Wartungsaufgaben.

## Tech Stack

- **Framework:** React Native (mit Expo)
- **State Management:** Zustand
- **Navigation:** @react-navigation
- **UI Library:** react-native-paper (Material Design)
- **HTTP Client:** Axios
- **Storage:** AsyncStorage
- **Icons:** MaterialCommunityIcons

## Installation

### Voraussetzungen
- Node.js 16+
- Expo CLI: `npm install -g expo-cli`
- Emulator oder Physical Device

### Setup

1. **Dependencies installieren:**
```bash
npm install
```

2. **Expo Server starten:**
```bash
npm start
```

3. **App öffnen:**
- iOS: Drücke `i` für iOS Simulator
- Android: Drücke `a` für Android Emulator
- Web: Drücke `w` für Web Browser
- Physical Device: Scanne QR Code mit Expo App

## Projektstruktur

```
src/
├── screens/           # App Hauptscreens
│   ├── LoginScreen.js       # Anmeldung
│   ├── RegisterScreen.js    # Registrierung
│   ├── BookingsScreen.js    # Buchungsverwaltung
│   ├── MaintenanceScreen.js # Wartungsaufgaben
│   ├── FieldsScreen.js      # Verfügbare Plätze
│   └── ProfileScreen.js     # Benutzerprofil
├── components/        # Wiederverwendbare Komponenten
├── services/          # API Service Calls
│   └── api.js         # Axios Configuration & Endpoints
├── store/             # Zustand Store
│   └── authStore.js   # Authentication State
└── ...
```

## State Management

### authStore

Verwaltet Authentifizierung und Benutzerdaten:

```javascript
import { useAuthStore } from '../store/authStore';

const { user, token, login, register, logout, loading, error } = useAuthStore();
```

**Methoden:**
- `login(email, password)` - Benutzer anmelden
- `register(email, password, name)` - Neuen Benutzer registrieren
- `logout()` - Benutzer abmelden
- `restoreToken()` - Gespeicherten Token laden (wird beim App-Start aufgerufen)
- `clearError()` - Fehlermeldung löschen

**State:**
- `user` - Angemeldeter Benutzer Object
- `token` - JWT Token
- `loading` - Boolean für Loading State
- `error` - Fehlermeldung String

## API Services

### Aufbau

```javascript
import { 
  authService, 
  bookingsService, 
  maintenanceService, 
  fieldsService 
} from '../services/api';
```

### Verfügbare Services

#### authService
```javascript
authService.login(email, password)
authService.register(email, password, name)
```

#### bookingsService
```javascript
bookingsService.getAll()
bookingsService.getById(id)
bookingsService.create(data)
bookingsService.update(id, data)
bookingsService.delete(id)
```

#### maintenanceService
```javascript
maintenanceService.getAll()
maintenanceService.getById(id)
maintenanceService.create(data)
maintenanceService.update(id, data)
maintenanceService.delete(id)
```

#### fieldsService
```javascript
fieldsService.getAll()
fieldsService.getById(id)
fieldsService.create(data)
fieldsService.update(id, data)
fieldsService.delete(id)
```

## Navigation

App hat zwei Navigation Stacks basierend auf Authentication:

### AuthStack (nicht angemeldet)
- LoginScreen
- RegisterScreen

### AppTabs (angemeldet)
- Bookings Tab
- Fields Tab
- Maintenance Tab
- Profile Tab

Navigation Switch findet in `App.js` statt:
```javascript
{user ? <AppTabs /> : <AuthStack />}
```

## Screens

### LoginScreen
Anmeldeseite mit E-Mail und Passwort Eingabefeld. Nutzt `useAuthStore().login()` für API Call.

### RegisterScreen
Registrierungsseite für neue Benutzer. Nutzt `useAuthStore().register()`.

### BookingsScreen
Zeigt alle Buchungen des Benutzers in einer Liste. Features:
- Liste aller Buchungen
- Pull-to-Refresh
- FAB zum Erstellen neuer Buchung
- Booking Detail Dialog

**Datenbindung:**
```javascript
const { data } = await bookingsService.getAll();
```

### MaintenanceScreen
Zeigt Wartungsaufgaben mit Prioritätsfarben. Features:
- Aufgabenliste mit Status
- Prioritätsanzeige (Low/Medium/High)
- Neue Aufgabe erstellen Dialog
- Aufgabenbenachrichtigungen

### FieldsScreen
Zeigt alle verfügbaren Sportplätze mit:
- Feldname und Typ
- Standort
- Preis pro Stunde
- Kapazität
- Verfügbarkeitsstatus

### ProfileScreen
Benutzerprofil mit:
- Benutzerdaten Anzeige
- Rolle anzeigen
- App Informationen
- Logout Button

## UI Komponenten

Die App nutzt **react-native-paper** für Material Design Komponenten:

```javascript
import { 
  Button, 
  Card, 
  TextInput, 
  Dialog, 
  Portal,
  FAB,
  Chip,
  HelperText 
} from 'react-native-paper';
```

## Styling

Alle Screens verwenden `StyleSheet.create()` für Performance:

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // ...
});
```

## Storage

AsyncStorage wird für persistente Daten genutzt:

```javascript
// Token speichern
await AsyncStorage.setItem('token', token);

// Token laden
const token = await AsyncStorage.getItem('token');

// Token löschen
await AsyncStorage.removeItem('token');
```

## Error Handling

Fehler werden in UI über HelperText oder Alert angezeigt:

```javascript
{error && <HelperText type="error">{error}</HelperText>}
```

## Datenformatierung

Date-fns wird für Datumformatierung genutzt:

```javascript
import { formatDate } from 'date-fns';
import { de } from 'date-fns/locale';

formatDate(new Date(item.booking_date), 'dd.MM.yyyy', { locale: de })
```

## Performance Optimierungen

- **React.memo** für Komponentenmemoization
- **FlatList** statt ScrollView für große Listen
- **LazyLoading** wo sinnvoll
- **Context API** statt Redux für State Management
- **Zustand** für minimales Bundle Size

## Debugging

```bash
# Logs in Console anschauen
npm start

# Remote Debugging mit React Developer Tools
# Drücke Shift+M im Expo App
```

## Build & Deployment

### iOS Build
```bash
expo build:ios
```

### Android Build
```bash
expo build:android
```

Weitere Info: https://docs.expo.dev/build/introduction/

## Testing

Unit Tests:
```bash
npm test
```

## Environment Setup

.env datei für API URL:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Troubleshooting

**App stürzt beim Start ab:**
- Stelle sicher, dass Backend läuft auf http://localhost:5000
- Überprüfe Network Verbindung

**Login funktioniert nicht:**
- Überprüfe JWT Token in authStore
- Siehe Backend Logs für API Fehler

**NativeModule Error:**
- Exe `expo prebuild --clean`
- Reboote Emulator/Device

---

Version: 1.0.0
