# Automatischer Spielplan aus fussball.de

## Wie das Ganze funktioniert

```
fussball.de iCal-Feeds   --(alle 6h)-->   GitHub Actions Workflow
                                                 |
                                                 v
                                          Node.js-Skript parst iCal
                                                 |
                                                 v
                                          games.json (im Repo)
                                                 |
                                                 v
                                          App lädt games.json
                                                 |
                                                 v
                                  Heimspiele erscheinen im Buchungskalender
```

- **Vollautomatisch:** Du musst nichts manuell aktualisieren. Sobald ein Spielleiter ein Spiel im DFBnet einträgt oder verlegt, ist es spätestens nach 6 Stunden in deiner App.
- **Nur Heimspiele:** Auswärtsspiele werden ignoriert (so wie du es entschieden hast).
- **Read-only:** Trainer und Admins können Spiele weder löschen noch verändern. Sie sind farblich orange markiert und mit dem 🏟️-Icon versehen.

---

## Was du jetzt tun musst (einmaliges Setup)

### Schritt 1 – iCal-URLs aller Mannschaften besorgen

Für **jede** Mannschaft, die du in den Kalender aufnehmen willst:

1. Auf [www.fussball.de](https://www.fussball.de) zur Mannschaftsseite navigieren
   - z. B. Sportfreunde Lauffen → A-Jugend
2. Im Mannschaftsbereich gibt es einen Button **„Termine abonnieren"** oder ein Kalender-Symbol mit „iCal"
3. Im Pop-up steht eine URL wie:
   ```
   https://www.fussball.de/ical/team-matchplan/01H6QXXXXX-G-XXXX
   ```
4. Diese URL **kopieren** (nicht abonnieren, nur den Link)

> **Tipp:** Wenn du keinen direkten Button findest, kannst du den iCal-Link auch direkt aus der URL ableiten: Auf der Mannschaftsseite findest du in der URL eine ID wie `01H6Q...`. Die iCal-URL hat dann die Form  
> `https://www.fussball.de/ical/team-matchplan/<TEAM-ID>`

### Schritt 2 – iCal-URLs in `teams-config.json` eintragen

Datei öffnen: `sportplatz-app/scripts/teams-config.json`

Pro Mannschaft die `icalUrl` ausfüllen. Beispiel:

```json
{
  "team": "A-Jugend",
  "field": "2",
  "fieldId": "2",
  "icalUrl": "https://www.fussball.de/ical/team-matchplan/01H6QABCD-G-1234"
}
```

**Erklärung der Felder:**

| Feld | Bedeutung |
|---|---|
| `team` | Name wie in der App (muss exakt zur Mannschaftsbezeichnung in den User-Profilen passen, sonst klappt die Berechtigung nicht) |
| `field` | Auf welchem Platz das Heimspiel typischerweise stattfindet (1, 2 oder 3) |
| `fieldId` | Gleiche Nummer wie `field` (für interne Logik) |
| `icalUrl` | Die kopierte fussball.de-URL |

Mannschaften, deren `icalUrl` **leer** ist, werden ignoriert. Du musst also nicht alle ausfüllen — z. B. wenn der AH-Bereich keine Pflichtspiele hat.

### Schritt 3 – Heim-Erkennung anpassen (falls nötig)

Damit das Skript Heim- von Auswärtsspielen unterscheiden kann, gibt es in `teams-config.json` zwei Listen:

```json
"homeVenueKeywords": ["Ulrichsheide", "Lauffen"],
"homeTeamKeywords": [
  "Sportfreunde Lauffen",
  "SF Lauffen",
  "SF-Lauffen",
  "Sportfr. Lauffen"
]
```

- **`homeVenueKeywords`:** Wenn im Spielort einer dieser Begriffe vorkommt → Heimspiel.
- **`homeTeamKeywords`:** Wenn dein Verein vorne im Spieltitel steht (typisches fussball.de-Format: „Heim – Auswärts") → Heimspiel.

> Schau zur Sicherheit nach **einem ersten Lauf** in der `games.json` rein, ob die Heimspiele richtig erkannt wurden. Wenn nicht, ergänze die Keywords um Schreibvarianten, wie sie im iCal-Feed wirklich stehen.

### Schritt 4 – Workflow zu GitHub pushen

Lade folgende neuen Dateien hoch:

```
.github/workflows/update-games.yml          (GitHub Actions Workflow)
sportplatz-app/scripts/package.json
sportplatz-app/scripts/fetch-games.js
sportplatz-app/scripts/teams-config.json     ← Hier deine iCal-URLs eintragen!
sportplatz-app/games.json                   (leere Initialdatei)
sportplatz-app/booking-calendar.html         (aktualisiert)
sportplatz-app/sw.js                         (Cache-Version v22)
sportplatz-app/SPIELPLAN-ANLEITUNG.md        (diese Anleitung)
```

> ⚠️ **Wichtiger Hinweis zur Pfad-Struktur:**  
> Der Workflow erwartet, dass dein Repo so aufgebaut ist:
> ```
> repo-root/
> ├── .github/workflows/update-games.yml        ← Workflow MUSS hier liegen
> └── sportplatz-app/
>     ├── scripts/
>     │   ├── fetch-games.js
>     │   ├── package.json
>     │   └── teams-config.json
>     ├── games.json
>     ├── booking-calendar.html
>     └── ...
> ```
>
> Wenn dein Repo-Root direkt `sportplatz-app/` ist (also kein Unterordner), musst du:
> 1. Den Ordner `.github/workflows/update-games.yml` aus `sportplatz-app/` direkt ins Repo-Root verschieben
> 2. Im Workflow alle Pfade `sportplatz-app/scripts` zu `scripts` und `sportplatz-app/games.json` zu `games.json` ändern

### Schritt 5 – Workflow zum ersten Mal manuell starten

1. Auf GitHub zu deinem Repo gehen
2. Tab **„Actions"** → links **„Update Spielplan aus fussball.de"** auswählen
3. Rechts oben **„Run workflow"** → **„Run workflow"** klicken
4. Warten (1-2 Minuten), bis der Workflow durchgelaufen ist
5. Prüfen: `sportplatz-app/games.json` sollte jetzt Spieldaten enthalten

Falls etwas schiefging, klick den Lauf an → Tab **„Spiele holen und games.json erzeugen"** → da siehst du detaillierte Logs.

### Schritt 6 – Berechtigung für GitHub Actions sicherstellen

Damit der Workflow `games.json` ins Repo schreiben darf:

1. Repo-Settings → **Actions** → **General**
2. Bei **„Workflow permissions"** muss **„Read and write permissions"** ausgewählt sein
3. Speichern

---

## Wie es im Buchungskalender aussieht

- **Im Monatskalender:** Spiele werden wie andere Buchungen am betreffenden Tag mitgezählt.
- **In der „Alle gebuchten Zeiten pro Platz"-Liste:**
  - Eintrag mit orangefarbenem Akzent
  - `🏟️ A-Jugend vs. TSV Beispiel`
  - Statt Löschen-Button: orange Badge **„🏟️ Heimspiel"**
- **In der Belegungsübersicht (Tag-Detail):**
  - Spiel-Block in orange (eigene Farbe in der Legende)
  - Mouseover: Detailinfo (Mannschaft, Gegner, Uhrzeit)
- **Trainer/Admins können Spiele NICHT löschen** — sie sind read-only.

---

## Wartung / Anpassungen später

- **Neue Mannschaft hinzufügen:** in `teams-config.json` einen Eintrag hinzufügen, iCal-URL eintragen → bei nächstem Workflow-Lauf erscheint sie.
- **iCal-URL falsch / Mannschaft ohne Spiele:** Workflow-Logs prüfen, dort steht z. B. „erhaltene Termine: 0".
- **Aktualisierung beschleunigen:** im YAML den Cron auf z. B. alle 3 Stunden setzen (`'17 */3 * * *'`). Achtung: GitHub Actions hat ein freies Kontingent — bei häufigen Läufen verbrauchst du das schneller. Alle 6h reicht völlig.
- **Manuell aktualisieren (z. B. nach Spielleiter-Änderung):** im Actions-Tab den Workflow per „Run workflow" erneut auslösen.

---

## Was tun, wenn ein Spiel falsch erkannt wird?

**Ein Auswärtsspiel taucht als Heimspiel auf:**
- Schau in `games.json` welches Format das `summary`-Feld hat
- Passe `homeTeamKeywords` oder `homeVenueKeywords` in `teams-config.json` an

**Ein Heimspiel wird nicht angezeigt:**
- Im Workflow-Log nach „erhaltene Termine" suchen → kommt da überhaupt etwas an?
- Ist die iCal-URL korrekt? (Im Browser öffnen → muss `.ics`-Inhalt anzeigen)
- Steht im iCal-Eintrag tatsächlich „Sportfreunde Lauffen" oder „Ulrichsheide"?

**Es kommen gar keine Spiele:**
- Repo-Settings → Actions → Workflow permissions = „Read and write"?
- Workflow-Log: wo bricht es ab?
- Pfadstruktur: liegt `.github/workflows/` wirklich im Repo-Root?

---

## Kosten

- **GitHub Actions:** kostenlos für öffentliche Repos. Bei privaten Repos: 2000 Minuten/Monat frei (unser Workflow braucht ca. 1 Minute/Lauf, also bei 4 Läufen/Tag = 120 Min/Monat → weit unter dem Limit).
- **fussball.de iCal:** kostenlos und ohne Limit.
- **Hosting (GitHub Pages):** unverändert kostenlos.

---

## Bei Problemen

Schreib mir die Workflow-Log-Ausgabe oder ein Stück aus `games.json`, dann debuggen wir gemeinsam.
