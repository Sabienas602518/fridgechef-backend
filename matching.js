function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}


function calculateRecipeMatch(recipe, pantry) {

  const recipeIngredients =
    Array.isArray(recipe.ingredients)
      ? recipe.ingredients
      : [];

  const stock =
    Array.isArray(pantry)
      ? pantry
      : [];


  const ingredientResults =
    recipeIngredients.map(recipeIngredient => {

      const recipeName =
        normalizeText(recipeIngredient.name);

      const recipeUnit =
        normalizeText(recipeIngredient.unit);

      const requiredQuantity =
        Number(recipeIngredient.quantity) || 0;


      const availableQuantity = stock
        .filter(stockIngredient =>
          normalizeText(stockIngredient.name) === recipeName &&
          normalizeText(stockIngredient.unit) === recipeUnit
        )
        .reduce(
          (sum, stockIngredient) =>
            sum + (Number(stockIngredient.quantity) || 0),
          0
        );


      const available =
        availableQuantity >= requiredQuantity;


      const missingQuantity =
        Math.max(
          requiredQuantity - availableQuantity,
          0
        );


      return {
        name: recipeIngredient.name,
        unit: recipeIngredient.unit,
        requiredQuantity,
        availableQuantity,
        missingQuantity,
        available
      };

    });


  const presentIngredients =
    ingredientResults.filter(
      ingredient => ingredient.available
    );


  const missingIngredients =
    ingredientResults.filter(
      ingredient => !ingredient.available
    );


  const totalIngredients =
    ingredientResults.length;


  const matchedIngredients =
    presentIngredients.length;


  const matchPercent =
    totalIngredients === 0
      ? 0
      : Math.round(
          matchedIngredients /
          totalIngredients *
          100
        );


  let category = 'nicht kochbar';

  if (matchPercent === 100) {
    category = 'kochbar';
  } else if (matchPercent >= 50) {
    category = 'fast kochbar';
  }


  return {
    recipeId:
      recipe._id
        ? recipe._id.toString()
        : '',

    recipeName:
      recipe.name,

    matchPercent,
    category,

    totalIngredients,
    matchedIngredients,

    presentIngredients,
    missingIngredients
  };
}


module.exports = {
  calculateRecipeMatch
};