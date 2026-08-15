require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
const PORT = 3000;


// MongoDB-Verbindung
mongoose.connect(
    process.env.DB_CONNECTION,
    { dbName: process.env.DATABASE }
);

const db = mongoose.connection;

db.on('error', (error) => {
    console.log(error);
});

db.once('open', () => {
    console.log('Mit MongoDB verbunden');
});


// Middleware
app.use(express.json());
app.use(cors());


// API-Routen
app.use('/api', routes);


// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});