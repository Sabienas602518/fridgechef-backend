# FridgeChef Backend

FridgeChef ist eine Webanwendung zur Verwaltung eines persönlichen Lebensmittelvorrats und von Rezepten.

Das Backend stellt eine REST-API bereit, über die Zutaten und Rezepte erstellt, gelesen, bearbeitet und gelöscht werden können.

Zusätzlich enthält FridgeChef eine Matching-Logik. Dabei werden die Zutaten eines Rezeptes mit dem aktuellen Vorrat verglichen. Die Anwendung bestimmt, welche Zutaten vorhanden oder fehlend sind und berechnet daraus einen Match-Prozentwert.

Neben selbst angelegten Rezepten können außerdem Online-Rezepte über die externe API TheMealDB gesucht und mit dem aktuellen Vorrat verglichen werden.


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
- Online-Rezeptempfehlungen über TheMealDB
- automatische Suche nach Online-Rezepten anhand des Vorrats
- Vergleich von Online-Rezeptzutaten mit vorhandenen Zutaten
- Berechnung eines Match-Prozentwertes für Online-Rezepte
- Anzeige fehlender Zutaten


## Technologien

Für das Backend werden verwendet:

- Node.js
- Express
- MongoDB
- Mongoose
- JavaScript
- dotenv
- CORS
- Fetch API
- TheMealDB API
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

Die `.env`-Datei enthält lokale Konfigurationsdaten und wird nicht in Git gespeichert.


## Seed-Daten

Mit dem Seed-Skript können Beispieldaten für den Vorrat und mehrere Rezepte angelegt werden.

```bash
node seed.js
```

Dabei werden die vorhandenen Zutaten und Rezepte der verwendeten Datenbank gelöscht und anschließend durch die im Seed-Skript definierten Beispieldaten ersetzt.

Das Seed-Skript dient dazu, schnell einen reproduzierbaren Testzustand herzustellen.


## Backend starten

Das Backend kann im Watch-Modus gestartet werden:

```bash
node --watch server.js
```

Danach läuft die API standardmäßig unter:

```text
http://localhost:3000
```

Bei erfolgreichem Start erscheint beispielsweise:

```text
Server läuft auf Port 3000
Mit MongoDB verbunden
```


# API

## Zutaten

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


## Rezepte

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


## Matching

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


## Online-Rezepte

Online-Rezeptempfehlungen laden:

```text
GET /api/online-recipes
```
Der Endpunkt liest zuerst die vorhandenen Zutaten aus MongoDB.

Anschließend werden passende Rezepte über die externe TheMealDB-API gesucht.

Die Zutaten der gefundenen Rezepte werden mit dem aktuellen Vorrat verglichen. Aus dem Ergebnis wird ein Match-Prozentwert berechnet.

Für die Online-Empfehlungen werden mehrere gefundene Rezepte geprüft, nach ihrem Match-Prozentwert sortiert und anschließend die besten Treffer an das Frontend zurückgegeben.

Häufig verwendete deutsche Zutaten werden in englische Begriffe umgewandelt, da TheMealDB englische Zutatenbezeichnungen verwendet.

Beispiel eines vereinfachten Ergebnisses:

```json
{
  "id": "53334",
  "title": "Arepa Pabellón",
  "image": "https://www.themealdb.com/images/media/meals/example.jpg",
  "matchPercent": 13,
  "category": "nicht kochbar",
  "totalIngredients": 8,
  "matchedIngredients": 1,
  "missingIngredients": []
}
```

Die Antwort kann zusätzlich Informationen enthalten wie:

- Rezeptbild
- Zutaten
- Mengenangaben der Online-API
- fehlende Zutaten
- Originalquelle
- YouTube-Link
- Zubereitungsbeschreibung


# Matching-Logik

## Matching eigener Rezepte

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


## Matching von Online-Rezepten

Bei Online-Rezepten wird ein vereinfachtes Matching verwendet.

Dabei wird hauptsächlich geprüft, ob eine benötigte Zutat im Vorrat vorhanden ist.

Der Grund dafür ist, dass TheMealDB Mengen und Einheiten teilweise als freien Text liefert.

Beispiele:

```text
1 cup
2 tbsp
Pinch
1/2 package
```

Diese Werte können nicht zuverlässig direkt mit den Mengen und Einheiten des FridgeChef-Vorrats verglichen werden.

Deshalb wird beim Online-Matching hauptsächlich mit den Namen der Zutaten gearbeitet.

Für einige häufig verwendete deutsche Zutaten werden außerdem einfache englische Übersetzungen verwendet, damit sie mit den Zutatenbezeichnungen von TheMealDB verglichen werden können.

Beispiele:

```text
Tomate → tomato
Milch → milk
Kartoffel → potato
Zwiebel → onion
Käse → cheese
```


# Projektstruktur

```text
fridgechef-backend
├── models
│   ├── ingredients.js
│   └── recipes.js
├── matching.js
├── matchingRoutes.js
├── matching.test.js
├── onlineRecipeRoutes.js
├── recipeRoutes.js
├── routes.js
├── seed.js
├── server.js
├── package.json
├── package-lock.json
└── README.md
```


# Tests

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
- Groß- und Kleinschreibung
- Mengenentscheidungen
- Online-Rezept-Endpunkt
- Verbindung zu TheMealDB
- Online-Matching
- fehlende Zutaten bei Online-Rezepten

Zusätzlich können die Matching-Grenzfälle mit folgendem Skript getestet werden:

```bash
node matching.test.js
```


# Frontend

Das zugehörige Angular-Frontend befindet sich in einem separaten Repository:

```text
fridgechef-frontend
```

Repository:

```text
https://github.com/Sabienas602518/fridgechef-frontend
```

Das Frontend verwendet die REST-API über:

```text
http://localhost:3000/api
```


# KI-Werkzeuge

ChatGPT :

Einsatzbereiche:

- Fragen zu JavaScript, Node.js und Express
- Unterstützung bei der Fehlersuche
- Erklärung von Fehlermeldungen
- Unterstützung bei der Einbindung von Online-Rezepten über TheMealDB
- Unterstützung bei Tests
- Unterstützung bei der Dokumentation


Die Vorschläge wurden in das eigene Projekt integriert, angepasst und praktisch getestet.


# Deployment

Das Projekt ist für ein späteres Deployment vorbereitet.

Der Backend-Port wird über eine Umgebungsvariable gelesen.

Falls keine Umgebungsvariable gesetzt ist, wird standardmäßig Port 3000 verwendet.

```javascript
const PORT = process.env.PORT || 3000;
```

Dadurch kann das Backend sowohl lokal als auch auf einer Hosting-Plattform mit einem vorgegebenen Port gestartet werden.


# Autorin
Sabiena Jeyaragawan, 2026

FridgeChef