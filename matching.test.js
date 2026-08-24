const assert =
  require('node:assert/strict');

const {
  calculateRecipeMatch
} = require('./matching');


const recipe = {
  _id: 'test-recipe',
  name: 'Tomatennudeln',

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
  ]
};


// TEST 1
// Leerer Vorrat
let result =
  calculateRecipeMatch(
    recipe,
    []
  );

assert.equal(
  result.matchPercent,
  0
);

assert.equal(
  result.category,
  'nicht kochbar'
);


// TEST 2
// Groß-/Kleinschreibung
result =
  calculateRecipeMatch(
    recipe,
    [
      {
        name: 'NUDELN',
        quantity: 200,
        unit: 'G'
      },
      {
        name: 'tomaten',
        quantity: 4,
        unit: 'stück'
      }
    ]
  );

assert.equal(
  result.matchPercent,
  100
);

assert.equal(
  result.category,
  'kochbar'
);


// TEST 3
// Menge reicht nicht
result =
  calculateRecipeMatch(
    recipe,
    [
      {
        name: 'Nudeln',
        quantity: 100,
        unit: 'g'
      },
      {
        name: 'Tomaten',
        quantity: 4,
        unit: 'Stück'
      }
    ]
  );

assert.equal(
  result.matchPercent,
  50
);

assert.equal(
  result.category,
  'fast kochbar'
);

assert.equal(
  result.missingIngredients[0]
    .missingQuantity,
  100
);


// TEST 4
// Gleiche Zutat mehrfach im Vorrat
result =
  calculateRecipeMatch(
    recipe,
    [
      {
        name: 'Nudeln',
        quantity: 100,
        unit: 'g'
      },
      {
        name: 'Nudeln',
        quantity: 100,
        unit: 'g'
      },
      {
        name: 'Tomaten',
        quantity: 4,
        unit: 'Stück'
      }
    ]
  );

assert.equal(
  result.matchPercent,
  100
);


console.log(
  'Alle Matching-Grenzfälle erfolgreich getestet.'
);