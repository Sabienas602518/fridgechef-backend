const express = require('express');
const router = express.Router();
const Ingredient = require('./models/ingredients');


// GET - alle Zutaten
router.get('/ingredients', async (req, res) => {
    try {
        const allIngredients = await Ingredient.find();

        res.status(200).send(allIngredients);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

// POST - neue Zutat erstellen
router.post('/ingredients', async(req, res) => {
    const newIngredient = new Ingredient({
        name: req.body.name,
        quantity: req.body.quantity,
        unit: req.body.unit,
        category: req.body.category,
        expiryDate: req.body.expiryDate
    });

    await newIngredient.save();
    res.send(newIngredient);
});

// GET - eine bestimmte Zutat
router.get('/ingredients/:id', async(req, res) => {
    const ingredient = await Ingredient.findOne({
        _id: req.params.id
    });

    if(ingredient) {
        res.send(ingredient);
    } else {
        res.status(404);
        res.send({
            error: "Zutat nicht gefunden!"
        });
    }
});



router.patch('/ingredients/:id', async(req, res) => {
    try {
        const ingredient =
            await Ingredient.findOne({ _id: req.params.id });

        if (req.body.name) {
            ingredient.name = req.body.name;
        }

        if (req.body.quantity) {
            ingredient.quantity = req.body.quantity;
        }

        if (req.body.unit) {
            ingredient.unit = req.body.unit;
        }

        if (req.body.category) {
            ingredient.category = req.body.category;
        }

        if (req.body.expiryDate) {
            ingredient.expiryDate = req.body.expiryDate;
        }

        await Ingredient.updateOne(
            { _id: req.params.id },
            ingredient
        );

        res.send(ingredient);

    } catch {
        res.status(404);
        res.send({
            error: 'Zutat nicht gefunden!'
        });
    }
});

router.delete('/ingredients/:id', async(req, res) => {
    try {
        await Ingredient.deleteOne({
            _id: req.params.id
        });

        res.status(204).send();

    } catch {
        res.status(404);
        res.send({
            error: "Zutat nicht gefunden!"
        });
    }
});

module.exports = router;