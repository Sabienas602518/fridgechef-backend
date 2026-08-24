# FridgeChef Backend

FridgeChef ist eine Webanwendung zur Verwaltung eines persönlichen Lebensmittelvorrats und von Rezepten.

Das Backend stellt eine REST-API bereit, über die Zutaten und Rezepte erstellt, gelesen, bearbeitet und gelöscht werden können.

Zusätzlich enthält FridgeChef eine Matching-Logik. Dabei werden die Zutaten eines Rezeptes mit dem aktuellen Vorrat verglichen. Die Anwendung bestimmt, welche Zutaten vorhanden oder fehlend sind und berechnet daraus einen Match-Prozentwert.

## Funktionen

Das Backend bietet unter anderem:

- Verwaltung von Vorratszutaten
- CRUD für Zutaten
- Verwaltung von Rezepten
- CRUD für Rezepte
- verschachtelte Rezeptzutaten
- Matching zwischen Vorrat und Rezept
- Berechnung des Match-Prozentwertes
- Kategorien:
  - kochbar
  - fast kochbar
  - nicht kochbar
- Seed-Skript mit Beispieldaten
- Verbindung zu MongoDB
- Fehlerbehandlung über HTTP-Statuscodes

## Technologien

Für das Backend werden verwendet:

- Node.js
- Express
- MongoDB
- Mongoose
- JavaScript
- dotenv
- CORS
- Git
- GitHub

## Voraussetzungen

Für die lokale Ausführung werden benötigt:

- Node.js
- npm
- MongoDB Community Server
- Git

MongoDB muss lokal laufen.

## Installation

Repository klonen:

```bash
git clone https://github.com/Sabienas602518/fridgechef-backend.git
```

In den Backend-Ordner wechseln:

```bash
cd fridgechef-backend
```

Abhängigkeiten installieren:

```bash
npm install
```

## Umgebungsvariablen

Im Hauptordner des Backends muss eine Datei mit dem Namen `.env` angelegt werden.

Beispiel:

```env
DB_CONNECTION=mongodb://127.0.0.1:27017
DATABASE=fridgechef
```

Die `.env`-Datei wird nicht in Git gespeichert.

## Seed-Daten

Mit dem Seed-Skript können Beispieldaten für den Vorrat und mehrere Rezepte angelegt werden.

```bash
node seed.js
```

Dabei werden die vorhandenen Zutaten und Rezepte der verwendeten Datenbank gelöscht und anschließend durch die definierten Beispieldaten ersetzt.

Das Seed-Skript dient dazu, schnell einen reproduzierbaren Testzustand herzustellen.

## Backend starten

Das Backend kann im Watch-Modus gestartet werden:

```bash
node --watch server.js
```

Danach läuft die API unter:

```text
http://localhost:3000
```

Bei erfolgreichem Start erscheint beispielsweise:

```text
Server läuft auf Port 3000
Mit MongoDB verbunden
```

## API

### Zutaten

Alle Zutaten laden:

```text
GET /api/ingredients
```

Eine Zutat laden:

```text
GET /api/ingredients/:id
```

Neue Zutat erstellen:

```text
POST /api/ingredients
```

Zutat bearbeiten:

```text
PATCH /api/ingredients/:id
```

Zutat löschen:

```text
DELETE /api/ingredients/:id
```

### Rezepte

Alle Rezepte laden:

```text
GET /api/recipes
```

Ein Rezept laden:

```text
GET /api/recipes/:id
```

Rezept erstellen:

```text
POST /api/recipes
```

Rezept bearbeiten:

```text
PATCH /api/recipes/:id
```

Rezept löschen:

```text
DELETE /api/recipes/:id
```

### Matching

Matching für ein Rezept berechnen:

```text
GET /api/matching/:recipeId
```

Beispiel eines Matching-Ergebnisses:

```json
{
  "recipeName": "Tomatennudeln",
  "matchPercent": 100,
  "category": "kochbar",
  "totalIngredients": 2,
  "matchedIngredients": 2,
  "missingIngredients": []
}
```

## Matching-Logik

Für jede Rezeptzutat wird geprüft:

1. Gibt es eine Zutat mit gleichem Namen im Vorrat?
2. Stimmen die Einheiten überein?
3. Ist mindestens die benötigte Menge vorhanden?

Groß- und Kleinschreibung wird beim Vergleich ignoriert.

Mehrere gleiche Vorratseinträge können für die verfügbare Menge zusammengezählt werden.

Aus der Anzahl vollständig vorhandener Rezeptzutaten wird ein Prozentwert berechnet.

Die Kategorien sind:

```text
100 %       → kochbar
50–99 %     → fast kochbar
unter 50 %  → nicht kochbar
```

## Projektstruktur

```text
fridgechef-backend
├── models
│   ├── ingredients.js
│   └── recipes.js
├── matching.js
├── matchingRoutes.js
├── matching.test.js
├── recipeRoutes.js
├── routes.js
├── seed.js
├── server.js
├── package.json
└── README.md
```

## Tests

Die API wurde während der Entwicklung unter anderem mit Thunder Client getestet.

Getestet wurden:

- GET
- POST
- PATCH
- DELETE
- ungültige Requests
- nicht vorhandene Datensätze
- Matching
- leerer Vorrat
- Groß-/Kleinschreibung
- Mengenentscheidungen

Zusätzlich können die Matching-Grenzfälle mit folgendem Skript getestet werden:

```bash
node matching.test.js
```

## Frontend

Das zugehörige Angular-Frontend befindet sich in einem separaten Repository:

```text
fridgechef-frontend
```

Das Frontend verwendet diese REST-API über:

```text
http://localhost:3000/api
```

## KI-Werkzeuge

Bei der Entwicklung wurde ChatGPT unterstützend verwendet.

Einsatzbereiche waren insbesondere:

- Erklärung von JavaScript- und TypeScript-Konzepten
- Unterstützung bei der Fehlersuche
- Erklärung von Fehlermeldungen
- Vorschläge zur Strukturierung von Code
- Unterstützung beim Refactoring
- Unterstützung bei Tests und Dokumentation

Der erzeugte bzw. vorgeschlagene Code wurde in das Projekt integriert, angepasst und praktisch getestet.

## Autorin

WebTech-Semesterprojekt  
FridgeChef

## Deployment

Das Projekt ist für ein späteres Deployment vorbereitet.

Der Backend-Port wird über eine Umgebungsvariable gelesen:

```text
PORT