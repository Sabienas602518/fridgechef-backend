const mongoose = require('mongoose');


const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 0
    },

    unit: {
      type: String,
      required: true
    }
  },
  {
    _id: false
  }
);


const recipeSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  duration: {
    type: Number,
    required: true,
    min: 1
  },

  servings: {
    type: Number,
    required: true,
    min: 1
  },

  difficulty: {
    type: String,
    required: true
  },

  ingredients: {
    type: [ingredientSchema],

    validate: {
      validator: function (ingredients) {
        return ingredients.length > 0;
      },

      message:
        'Mindestens eine Zutat ist erforderlich'
    }
  },

  instructions: {
    type: [String],

    validate: {
      validator: function (instructions) {
        return instructions.length > 0;
      },

      message:
        'Mindestens ein Zubereitungsschritt ist erforderlich'
    }
  }

});


module.exports =
  mongoose.model(
    'Recipe',
    recipeSchema
  );