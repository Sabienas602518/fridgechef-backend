require('dotenv').config();

const mongoose = require('mongoose');

const Ingredient = require('./models/ingredients');
const Recipe = require('./models/recipes');


const ingredients = [
  {
    name: 'Nudeln',
    quantity: 500,
    unit: 'g',
    category: 'Getreide',
    expiryDate: new Date('2026-11-02')
  },
  {
    name: 'Tomaten',
    quantity: 4,
    unit: 'Stück',
    category: 'Gemüse',
    expiryDate: new Date('2026-08-26')
  },
  {
    name: 'Apfel',
    quantity: 2,
    unit: 'Stück',
    category: 'Obst',
    expiryDate: new Date('2026-08-30')
  },
  {
    name: 'Milch',
    quantity: 1,
    unit: 'l',
    category: 'Milchprodukte',
    expiryDate: new Date('2026-08-25')
  }
];


const recipes = [
  {
    name: 'Tomatennudeln',
    description: 'Schnelle Nudeln mit Tomaten',
    duration: 25,
    servings: 2,
    difficulty: 'einfach',

    ingredients: [
      {
        name: 'Nudeln',
        quantity: 200,
        unit: 'g'
      },
      {
        name: 'Tomaten',
        quantity: 4,
        unit: 'Stück'
      }
    ],

    instructions: [
      'Nudeln kochen',
      'Tomaten schneiden',
      'Tomaten zu den Nudeln geben'
    ]
  },

  {
    name: 'Obstsalat',
    description: 'Einfacher Obstsalat',
    duration: 10,
    servings: 2,
    difficulty: 'einfach',

    ingredients: [
      {
        name: 'Apfel',
        quantity: 1,
        unit: 'Stück'
      },
      {
        name: 'Banane',
        quantity: 1,
        unit: 'Stück'
      }
    ],

    instructions: [
      'Obst waschen',
      'Obst klein schneiden',
      'Alles vermischen'
    ]
  },

  {
    name: 'Milch-Nudeln',
    description: 'Einfaches Rezept mit Milch und Nudeln',
    duration: 20,
    servings: 2,
    difficulty: 'einfach',

    ingredients: [
      {
        name: 'Nudeln',
        quantity: 150,
        unit: 'g'
      },
      {
        name: 'Milch',
        quantity: 1,
        unit: 'l'
      }
    ],

    instructions: [
      'Nudeln kochen',
      'Milch erwärmen',
      'Alles zusammengeben'
    ]
  }
];


async function seedDatabase() {

  try {

    await mongoose.connect(
      process.env.DB_CONNECTION,
      {
        dbName: process.env.DATABASE
      }
    );

    console.log('Mit MongoDB verbunden');


    // Alte Beispieldaten löschen
    await Ingredient.deleteMany({});
    await Recipe.deleteMany({});


    // Neue Beispieldaten speichern
    await Ingredient.insertMany(
      ingredients
    );

    await Recipe.insertMany(
      recipes
    );


    console.log(
      'Seed-Daten erfolgreich gespeichert'
    );


  } catch (error) {

    console.error(
      'Fehler beim Seed:',
      error.message
    );


  } finally {

    await mongoose.connection.close();

    console.log(
      'MongoDB-Verbindung geschlossen'
    );

  }
}


seedDatabase();