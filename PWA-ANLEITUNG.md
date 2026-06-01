# 📱 SFL Manager als App aufs Handy bekommen

Deine Sportfreunde Lauffen App ist jetzt eine **Progressive Web App (PWA)**. Das heißt: Sie kann auf jedem Handy direkt vom Homescreen gestartet werden – wie eine echte App. Kein App Store, keine Installation nötig.

---

## 🎨 SCHRITT 1: App-Icons erzeugen (einmalig)

1. Öffne die Datei `generate-icons.html` **lokal im Browser** (Doppelklick).
2. Klick auf **"Beide Icons herunterladen"**.
3. Verschiebe die heruntergeladenen Dateien `icon-192.png` und `icon-512.png` in den Ordner `sportplatz-app/assets/icons/`.

✅ Fertig - die Icons werden automatisch von der PWA verwendet.

---

## 🌐 SCHRITT 2: App ins Internet stellen (GitHub Pages)

Damit das Handy die App laden kann, muss sie online sein. **GitHub Pages ist 100% kostenlos**.

### A) GitHub-Konto erstellen

1. Gehe zu [https://github.com](https://github.com)
2. Klicke auf **"Sign up"** und erstelle ein kostenloses Konto.

### B) Repository erstellen

1. Klicke oben rechts auf **"+"** → **"New repository"**.
2. **Repository name**: `sportfreunde-lauffen-app` (oder beliebig)
3. Wähle **"Public"** (muss public sein für GitHub Pages kostenlos).
4. Häkchen bei **"Add a README file"** → **NICHT** aktivieren (haben wir schon).
5. Klick **"Create repository"**.

### C) Projekt hochladen (einfachste Variante: Drag & Drop)

1. Im neuen Repository: Klick auf **"uploading an existing file"** (Link in der Mitte der Seite).
2. **Ziehe den gesamten Inhalt des Ordners `sportplatz-app`** (NICHT den Ordner selbst, sondern den Inhalt!) ins Browser-Fenster.
   - Also: `index.html`, `booking-calendar.html`, `manifest.webmanifest`, `sw.js`, `assets/`, etc.
3. Unten **"Commit changes"** klicken.
4. Warte, bis der Upload fertig ist.

### D) GitHub Pages aktivieren

1. Im Repository oben auf **"Settings"** klicken.
2. Links im Menü auf **"Pages"** klicken.
3. Unter **"Source"**: Branch **"main"** wählen, Ordner **"/ (root)"**.
4. **"Save"** klicken.
5. **2-3 Minuten warten**, dann erscheint oben eine URL wie:
   ```
   https://DEIN-USERNAME.github.io/sportfreunde-lauffen-app/
   ```

✅ **Das ist deine App-URL!** Sie ist jetzt weltweit erreichbar.

---

## 📲 SCHRITT 3: App aufs Handy installieren

### Android (Chrome)

1. Öffne die GitHub-Pages-URL auf deinem Handy in Chrome.
2. Es erscheint unten/oben ein Banner **"App installieren"** → drauftippen.
3. Falls nicht: Menü (3 Punkte) → **"App installieren"** oder **"Zum Startbildschirm hinzufügen"**.
4. Fertig! App-Icon ist auf dem Homescreen.

### iPhone (Safari)

1. Öffne die URL in **Safari** (nicht Chrome auf iOS).
2. Tippe unten auf das **Teilen-Symbol** (Quadrat mit Pfeil nach oben).
3. Wähle **"Zum Home-Bildschirm"**.
4. Name bestätigen → **"Hinzufügen"**.
5. Die App startet jetzt im Vollbild ohne Safari-Leiste.

---

## 🔄 SCHRITT 4: Updates veröffentlichen

Wenn du etwas änderst, einfach die geänderten Dateien wieder hochladen:

1. Im Repository: Datei anklicken → **Stift-Symbol** zum Bearbeiten ODER
2. Neue Dateien per Drag & Drop: **"Add file"** → **"Upload files"**
3. Unten **"Commit changes"**.

Innerhalb von 1-2 Minuten ist das Update auf der App-URL aktiv. Die Service-Worker-Version in `sw.js` (`sfl-manager-v1`) bei größeren Updates hochzählen (`v2`, `v3`, …), damit der Cache neu geladen wird.

---

## 🔥 SCHRITT 5: Firebase-Backend (bereits integriert!)

Die App ist bereits mit deinem Firebase-Projekt **`sfl-manager`** verbunden. Folgende Daten werden in Echtzeit zwischen allen Geräten synchronisiert:

| Was | Firebase-Pfad |
|---|---|
| Trainingsbuchungen | `/bookings` |
| Bus-Reservierungen | `/busBookings` |
| Trainer / Benutzer | `/users` |
| Gelöschte Serien-Termine | `/deletedSeries` |
| Eigene Sportplätze | `/customFields` |
| Vereins-Chat | `/chat` |

### 🔐 Wichtig: Datenbank-Regeln setzen

Standardmäßig läuft Firebase im **Testmodus** = jeder im Internet kann mit den Daten machen, was er will. Setze in der Firebase-Konsole stabilere Regeln:

1. Gehe zu [console.firebase.google.com](https://console.firebase.google.com) → dein Projekt **sfl-manager**
2. Linkes Menü: **Realtime Database** → Reiter **"Regeln"**
3. Ersetze den Inhalt mit:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Das ist die einfachste Variante: **jeder, der die App-URL kennt, kann lesen und schreiben**. Für den Verein praktikabel, da die App-URL nur intern geteilt wird.

**Optional (sicherer)**: Wenn du später Firebase Authentication einbauen willst, kannst du die Regeln auf eingeloggte Nutzer einschränken. Sag mir Bescheid, wenn du das möchtest.

### ⚠️ Achtung – Testmodus läuft nach 30 Tagen ab

Falls du beim Erstellen "Testmodus" gewählt hast, hat Firebase automatisch eine **30-Tage-Beschränkung** gesetzt. Mit den obigen Regeln (`true`) wird das überschrieben. **Unbedingt machen**, sonst hört die App nach 30 Tagen auf zu funktionieren!

### Was funktioniert jetzt?

- ✅ **Live-Chat**: Schreibst du auf Handy A, sieht es Handy B sofort
- ✅ **Buchungen vereinsweit**: Jeder Trainer sieht alle Buchungen
- ✅ **Bus-Reservierungen vereinsweit**
- ✅ **Trainer-Codes zentral**: Wer in `users.html` Admin/Trainer anlegt, kann sich überall einloggen
- ✅ **Offline-fähig**: Ohne Internet wird der letzte Stand angezeigt; sobald online, wird wieder synchronisiert

---

## ❓ Häufige Probleme

**Problem: Icons werden nicht angezeigt**
→ Stelle sicher, dass `icon-192.png` und `icon-512.png` im Ordner `assets/icons/` liegen.

**Problem: "App installieren" Button erscheint nicht**
→ Funktioniert nur über **HTTPS** (auf GitHub Pages automatisch der Fall). Lokal (file://) funktioniert es nicht.

**Problem: Alte Version wird angezeigt**
→ In `sw.js` die Versionsnummer hochzählen (z.B. `sfl-manager-v1` → `v2`), neu hochladen.

**Problem: Daten sind weg nach Browser-Wechsel**
→ Das ist normal bei LocalStorage. Lösung = Firebase Backend (Schritt 5).

---

## 📋 Zusammenfassung Dateien

Diese Dateien wurden für die PWA hinzugefügt:

| Datei | Zweck |
|---|---|
| `manifest.webmanifest` | App-Metadaten (Name, Icons, Farbe) |
| `sw.js` | Service Worker für Offline-Modus |
| `pwa-register.js` | Registrierung des Service Workers |
| `offline.html` | Anzeige bei fehlendem Internet |
| `generate-icons.html` | Tool zum Erzeugen der App-Icons |
| `assets/icons/icon-192.png` | App-Icon (192x192) |
| `assets/icons/icon-512.png` | App-Icon (512x512) |
