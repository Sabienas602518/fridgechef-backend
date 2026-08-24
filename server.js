require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');
const recipeRoutes = require('./recipeRoutes');
const matchingRoutes = require('./matchingRoutes');

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


db.on('error', error => {
  console.log(error);
});


db.once('open', () => {
  console.log('Mit MongoDB verbunden');
});


// JSON aus Requests lesen
app.use(express.json());


// Angular-Zugriff erlauben
app.use(cors());


// Zutaten
app.use('/api', routes);


// Rezepte
app.use('/api/recipes', recipeRoutes);


// Matching
app.use('/api/matching', matchingRoutes);


// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});