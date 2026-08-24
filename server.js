require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');
const recipeRoutes = require('./recipeRoutes');
const matchingRoutes = require('./matchingRoutes');

const app = express();

const PORT = 3000;


// Middleware
app.use(express.json());
app.use(cors());


// API-Routen
app.use('/api', routes);

app.use(
  '/api/recipes',
  recipeRoutes
);

app.use(
  '/api/matching',
  matchingRoutes
);


// Unbekannte API-Route
app.use((req, res) => {

  res.status(404).send({
    message: 'Route nicht gefunden'
  });

});


// MongoDB verbinden
mongoose.connect(
  process.env.DB_CONNECTION,
  {
    dbName:
      process.env.DATABASE
  }
)
.then(() => {

  console.log(
    'Mit MongoDB verbunden'
  );

})
.catch(error => {

  console.error(
    'MongoDB-Verbindung fehlgeschlagen:',
    error.message
  );

});


// Server starten
app.listen(PORT, () => {

  console.log(
    `Server läuft auf Port ${PORT}`
  );

});