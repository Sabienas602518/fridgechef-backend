const express = require('express');

const router = express.Router();

const Recipe =
  require('./models/recipes');


// READ - alle Rezepte
router.get('/', async (req, res) => {

  try {

    const recipes =
      await Recipe.find();

    res
      .status(200)
      .send(recipes);

  } catch (error) {

    res
      .status(500)
      .send({
        message: error.message
      });

  }

});


// READ - ein bestimmtes Rezept
router.get('/:id', async (req, res) => {

  try {

    const recipe =
      await Recipe.findById(
        req.params.id
      );


    if (!recipe) {

      return res
        .status(404)
        .send({
          message:
            'Rezept nicht gefunden'
        });

    }


    res
      .status(200)
      .send(recipe);

  } catch (error) {

    res
      .status(400)
      .send({
        message: error.message
      });

  }

});


// CREATE - neues Rezept
router.post('/', async (req, res) => {

  try {

    const recipe =
      new Recipe({

        name:
          req.body.name,

        description:
          req.body.description,

        duration:
          req.body.duration,

        servings:
          req.body.servings,

        difficulty:
          req.body.difficulty,

        ingredients:
          req.body.ingredients,

        instructions:
          req.body.instructions

      });


    const savedRecipe =
      await recipe.save();


    res
      .status(201)
      .send(savedRecipe);

  } catch (error) {

    res
      .status(400)
      .send({
        message: error.message
      });

  }

});


// UPDATE - Rezept bearbeiten
router.patch('/:id', async (req, res) => {

  try {

    const updatedRecipe =
      await Recipe.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
          runValidators: true
        }

      );


    if (!updatedRecipe) {

      return res
        .status(404)
        .send({
          message:
            'Rezept nicht gefunden'
        });

    }


    res
      .status(200)
      .send(updatedRecipe);

  } catch (error) {

    res
      .status(400)
      .send({
        message: error.message
      });

  }

});


// DELETE - Rezept löschen
router.delete('/:id', async (req, res) => {

  try {

    const deletedRecipe =
      await Recipe.findByIdAndDelete(
        req.params.id
      );


    if (!deletedRecipe) {

      return res
        .status(404)
        .send({
          message:
            'Rezept nicht gefunden'
        });

    }


    res
      .status(204)
      .send();

  } catch (error) {

    res
      .status(400)
      .send({
        message: error.message
      });

  }

});


module.exports = router; 