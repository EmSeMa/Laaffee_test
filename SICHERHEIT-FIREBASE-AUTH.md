# Sicherheits-Setup: Firebase-Auth-Gate für die SFL-App

## Was du jetzt hast (Stand der Implementierung)

- Beim Öffnen **jeder** Seite (`index.html`, `booking-calendar.html`, `bus-booking.html`, `users.html`, `fields.html`, `maintenance.html`, `analytics.html`) erscheint **zuerst eine Login-Maske**.
- Erst nach Eingabe von **E-Mail + Vereinspasswort** wird die Seite freigegeben.
- `firebase-sync.js` verbindet sich **erst nach erfolgreichem Login** mit der Datenbank.
- Sobald wir gleich die Datenbank-Regeln umstellen, kann **niemand** mehr ohne Login Daten lesen oder schreiben — auch nicht über die Firebase-URL direkt oder über Browser-Tools.

---

## Was du jetzt noch tun musst (einmalig in der Firebase Console)

### Schritt 1 – Email/Password Authentication aktivieren

1. Gehe zu [console.firebase.google.com](https://console.firebase.google.com).
2. Wähle dein Projekt **`sfl-manager`**.
3. Linkes Menü: **„Build" → „Authentication"**.
4. Falls Authentication noch nicht aktiviert ist: **„Get started"** klicken.
5. Tab **„Sign-in method"** auswählen.
6. Bei **„Email/Password"** auf den Stift klicken → **„Enable"** auf ON → **„Save"**.

### Schritt 2 – Vereinsaccount anlegen

Da die App **nur ein Passwort** abfragt (kein E-Mail-Feld), wird eine **feste E-Mail-Adresse** im Hintergrund verwendet. Du musst genau diese E-Mail in Firebase anlegen.

1. Im Authentication-Bereich Tab **„Users"** öffnen.
2. **„Add user"** klicken.
3. Eingeben:
   - **Email:** **exakt `verein@sfl-lauffen.de`** (genau so, keine echte Mailadresse nötig)
   - **Password:** ein **starkes Vereinspasswort**, z. B. `SFL-Lauffen-2026!` (mindestens 6 Zeichen, gerne länger und komplex) — **das ist das Passwort, das deine Trainer in der App eingeben**
4. **„Add user"** klicken → fertig.

> ⚠️ **Wichtig:** Die E-Mail-Adresse muss exakt mit dem Wert in `firebase-config.js` übereinstimmen (`window.SFL_LOGIN_EMAIL`). Möchtest du eine andere E-Mail nutzen, ändere sie an **beiden** Stellen.

Wenn das Passwort später mal geleakt wird: Einfach hier in der Firebase Console das Passwort ändern und die Trainer per WhatsApp informieren.

### Schritt 3 – Datenbank-Regeln umstellen

Das ist der wichtigste Schritt — **ohne den ist der Schutz nicht echt!**

1. Linkes Menü: **„Build" → „Realtime Database"**.
2. Oben Tab **„Rules"**.
3. Den kompletten Inhalt ersetzen durch:

   ```json
   {
     "rules": {
       ".read": "auth != null",
       ".write": "auth != null"
     }
   }
   ```

4. **„Publish"** klicken.

Damit ist die DB **vollständig dicht** für jeden, der nicht eingeloggt ist. Wer die Firebase-URL direkt aufruft, bekommt „Permission denied" zurück. Wer im Browser den App-Code öffnet, sieht zwar weiter HTML/JS — aber ohne Login bleibt das alles nur eine leere Hülle ohne Daten.

---

## Wie sich das aus User-Sicht anfühlt

1. **Erstmaliger Besuch (z. B. dein Trainer öffnet die App):**
   - Schwarz-grauer Bildschirm mit Login-Maske erscheint
   - Trainer gibt nur das **Vereinspasswort** ein (kein E-Mail-Feld)
   - App-Inhalt wird sichtbar
   - Trainer meldet sich zusätzlich (falls nötig) mit seinem **persönlichen 4-stelligen Code** an (für Admin- vs. Trainer-Rolle in den Buchungen)

2. **Wiederholter Besuch:**
   - Firebase merkt sich den Login automatisch im Browser
   - Es erscheint **direkt die App** — keine erneute Eingabe nötig
   - Solange der Browser-Cache nicht geleert wird, bleibt man eingeloggt

3. **Logout (falls nötig):**
   - Aktuell kein UI-Button (kann ich dir bei Bedarf einbauen)
   - Workaround: Browser-Cache / App-Daten löschen
   - Oder per Konsole: `SFLAuth.logout()` im Browser DevTools

---

## Was passiert, wenn jemand das Vereinspasswort weitergibt?

- In der Firebase Console kannst du das Passwort jederzeit ändern → alte Sessions laufen weiter (Token gültig ca. 1h), neue Logins gehen nur mit neuem Passwort
- Komplett alle eingeloggten Geräte rauswerfen: in der Firebase Console unter **Authentication → Users → den User → ⋮ → „Reset password"** klicken (sendet aber keine Mail bei selbst-erstellten Accounts, ändert nur das Passwort intern). Sauberer: User löschen + neu anlegen.

---

## Was schützt das **nicht**?

- Der **HTML/JS-Code** der App bleibt öffentlich auf GitHub Pages sichtbar. Das ist OK, weil der Code allein nichts kann ohne Login. Keine Geheimnisse oder Daten stehen dort drin.
- Wenn jemand das Vereinspasswort **plus** die Firebase-URL kennt, könnte er theoretisch auch außerhalb deiner App auf die Daten zugreifen. Da die Daten aber nichts Sensibles enthalten (keine Bankdaten, keine Passwörter) und das Vereinspasswort vertraulich bleibt, ist das Risiko gering.

---

## Wenn du noch eine Schicht oben drauf willst (optional, später)

- **Firebase App Check** aktivieren → blockiert Zugriffe aus nicht-registrierten Anwendungen (z. B. cURL, Postman). Aufwand: ~30 Minuten.
- **Domain-Restrictions** für den API-Key in der Google Cloud Console → erlaubt API-Aufrufe nur von deiner GitHub-Pages-Domain.

Beides ist nicht zwingend, aber „nice to have". Sag Bescheid, wenn du das angehen willst.

---

## Zusammenfassung Pflicht-Schritte für dich

- [ ] **Firebase Console → Authentication → Email/Password aktivieren**
- [ ] **Vereinsaccount mit E-Mail + Passwort anlegen**
- [ ] **Realtime Database Rules auf `"auth != null"` setzen**
- [ ] **Geänderte Dateien zu GitHub pushen** (`auth-gate.js`, `firebase-config.js`, `firebase-sync.js`, alle 7 HTML-Seiten, `sw.js`)
- [ ] **In der App testen:** Inkognito-Browser öffnen → muss Login-Maske zeigen, Eingabe → Seite funktioniert. Versuch mit falscher E-Mail/falschem Passwort → muss Fehlermeldung anzeigen.

Wenn etwas hakt, sag Bescheid.
