require('dotenv').config();

const express = require('express');

const cors = require('cors');

const mongoose = require('mongoose');

const routes = require('./routes');

const recipeRoutes = require('./recipeRoutes');


const app = express();

const PORT = 3000;


// MongoDB verbinden
mongoose.connect(
  process.env.DB_CONNECTION,
  {
    dbName: process.env.DATABASE
  }
);


const db = mongoose.connection;


// MongoDB-Fehler
db.on('error',(error) => {   console.log(error);

  }
);


// Erfolgreiche MongoDB-Verbindung
db.once('open',() => { console.log('Mit MongoDB verbunden');});


// JSON aus Requests lesen
app.use( express.json());


// CORS erlauben
app.use(cors());


// Zutaten-Routen
app.use('/api',routes);


// Rezept-Routen
app.use('/api/recipes',recipeRoutes);


// Server starten
app.listen(PORT, () => { console.log(`Server läuft auf Port ${PORT}`); });