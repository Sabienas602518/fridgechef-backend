const express = require('express');

const router = express.Router();

const Recipe = require('./models/recipes');
const Ingredient = require('./models/ingredients');

const {
  calculateRecipeMatch
} = require('./matching');


router.get('/:recipeId', async (req, res) => {

  try {

    const recipe =
      await Recipe
        .findById(req.params.recipeId)
        .lean();


    if (!recipe) {
      return res.status(404).send({
        message: 'Rezept nicht gefunden'
      });
    }


    const pantry =
      await Ingredient
        .find()
        .lean();


    const result =
      calculateRecipeMatch(
        recipe,
        pantry
      );


    res.status(200).send(result);

  } catch (error) {

    res.status(400).send({
      message: error.message
    });

  }

});


module.exports = router;