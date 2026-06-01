# Backend dokumentation

## Übersicht

Das Backend ist ein Node.js/Express Server, der als RESTful API für die Sportplatzverwaltungs-App fungiert.

## Installation & Setup

### 1. Dependencies installieren
```bash
npm install
```

### 2. Datenbank Setup

PostgreSQL Datenbank erstellen:
```bash
createdb sportplatz_db
```

Tabellen erstellen:
```bash
psql sportplatz_db < database.sql
```

### 3. Environment Variablen
.env Datei erstellen:
```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=deinPasswort
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sportplatz_db
JWT_SECRET=dein_geheimer_schlüssel
NODE_ENV=development
```

### 4. Server starten
```bash
npm start        # Produktionsmodus
npm run dev      # Entwicklungsmodus mit Nodemon
```

## API Dokumentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### Felder (Fields)

#### Get All Fields
```http
GET /api/fields
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Hauptplatz",
    "type": "football",
    "location": "Lauffen",
    "price_per_hour": 25.00,
    "capacity": 22,
    "is_available": true,
    "created_at": "2026-05-28T10:00:00Z",
    "updated_at": "2026-05-28T10:00:00Z"
  }
]
```

#### Get Field by ID
```http
GET /api/fields/1
Authorization: Bearer <token>
```

#### Create Field
```http
POST /api/fields
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Trainingplatz",
  "type": "football",
  "location": "Parkstraße",
  "price_per_hour": 20.00,
  "capacity": 11
}
```

#### Update Field
```http
PUT /api/fields/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Trainingplatz",
  "type": "football",
  "location": "Parkstraße",
  "price_per_hour": 22.00,
  "capacity": 11,
  "is_available": true
}
```

#### Delete Field
```http
DELETE /api/fields/1
Authorization: Bearer <token>
```

### Buchungen (Bookings)

#### Get All Bookings
```http
GET /api/bookings
Authorization: Bearer <token>
```

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "field_id": 1,
  "user_id": 1,
  "booking_date": "2026-06-15",
  "start_time": "18:00",
  "end_time": "19:00",
  "total_price": 25.00
}
```

#### Update Booking
```http
PUT /api/bookings/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "field_id": 1,
  "booking_date": "2026-06-15",
  "start_time": "19:00",
  "end_time": "20:00",
  "total_price": 25.00,
  "status": "confirmed"
}
```

#### Delete Booking
```http
DELETE /api/bookings/1
Authorization: Bearer <token>
```

### Wartungsaufgaben (Maintenance)

#### Get All Tasks
```http
GET /api/maintenance
Authorization: Bearer <token>
```

#### Create Task
```http
POST /api/maintenance
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Rasen mähen",
  "description": "Hauptplatz Rasen mähen und düngen",
  "field_id": 1,
  "task_type": "maintenance",
  "scheduled_date": "2026-06-01",
  "priority": "high",
  "assigned_to": 2
}
```

#### Update Task
```http
PUT /api/maintenance/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Rasen mähen",
  "description": "Hauptplatz Rasen mähen und düngen",
  "field_id": 1,
  "task_type": "maintenance",
  "scheduled_date": "2026-06-01",
  "priority": "high",
  "assigned_to": 2,
  "status": "completed",
  "completed_date": "2026-06-01"
}
```

#### Delete Task
```http
DELETE /api/maintenance/1
Authorization: Bearer <token>
```

## Error Handling

Fehler werden in folgendem Format zurückgegeben:

```json
{
  "error": "Fehlerbeschreibung"
}
```

### Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Middleware

### Authentication
Alle geschützten Endpoints benötigen einen JWT Token im Authorization Header:

```http
Authorization: Bearer <token>
```

## Database

### Connections Pool
Der Server verwendet PG Pool für Connection Management. Siehe `server.js` für Details.

### Migrationen
Zukünftige Datenbankänderungen sollten in `database.sql` dokumentiert werden.

## Sicherheit

- Passwörter werden mit bcrypt gehashed (10 rounds)
- JWT Tokens haben eine Gültigkeit von 24h
- CORS ist aktiviert für Frontend-Zugriff
- SQL Injection wird durch parameterized queries verhindert

## Performance

- Database Indexe sind auf häufig abgefragte Spalten erstellt
- Query Optimization für große Datenmengen
- Connection Pooling für besseren Performance

## Versionierung

Aktuelle Version: 1.0.0

Die API wird versioniert über URL-Pfad (/api/v1) für zukünftige Rückwärtskompatibilität.
