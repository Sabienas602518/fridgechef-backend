const express = require('express');
const router = express.Router();

const Ingredient = require('./models/ingredients');


// Deutsche Zutaten in englische Begriffe übersetzen,
// weil TheMealDB englische Zutaten verwendet.
function translateIngredient(name) {

    const ingredientName =
        name.trim().toLowerCase();

    if (
        ingredientName === 'tomate' ||
        ingredientName === 'tomaten'
    ) {
        return 'tomato';
    }

    if (
        ingredientName === 'nudeln' ||
        ingredientName === 'pasta'
    ) {
        return 'pasta';
    }

    if (ingredientName === 'milch') {
        return 'milk';
    }

    if (
        ingredientName === 'apfel' ||
        ingredientName === 'äpfel'
    ) {
        return 'apple';
    }

    if (
        ingredientName === 'banane' ||
        ingredientName === 'bananen'
    ) {
        return 'banana';
    }

    if (
        ingredientName === 'kartoffel' ||
        ingredientName === 'kartoffeln'
    ) {
        return 'potato';
    }

    if (ingredientName === 'reis') {
        return 'rice';
    }

    if (
        ingredientName === 'ei' ||
        ingredientName === 'eier'
    ) {
        return 'egg';
    }

    if (
        ingredientName === 'zwiebel' ||
        ingredientName === 'zwiebeln'
    ) {
        return 'onion';
    }

    if (ingredientName === 'käse') {
        return 'cheese';
    }

    if (ingredientName === 'butter') {
        return 'butter';
    }

    if (ingredientName === 'mehl') {
        return 'flour';
    }

    return ingredientName;
}


// Zutaten eines Online-Rezeptes auslesen.
function getRecipeIngredients(meal) {

    const ingredients = [];

    for (let i = 1; i <= 20; i++) {

        const name =
            meal['strIngredient' + i];

        const measure =
            meal['strMeasure' + i];

        if (
            name &&
            name.trim() !== ''
        ) {

            ingredients.push({
                name: name.trim(),
                measure: measure
                    ? measure.trim()
                    : ''
            });
        }
    }

    return ingredients;
}


// GET /api/online-recipes
router.get('/', async(req, res) => {

    try {

        // Vorrat aus MongoDB holen.
        const pantry =
            await Ingredient.find();


        if (pantry.length === 0) {

            res.status(200);
            res.send([]);

            return;
        }


        // Vorratsnamen vorbereiten.
        const pantryNames = [];

        for (const ingredient of pantry) {

            const translatedName =
                translateIngredient(
                    ingredient.name
                );

            if (
                !pantryNames.includes(
                    translatedName
                )
            ) {

                pantryNames.push(
                    translatedName
                );
            }
        }


        // Gefundene Online-Rezepte.
        const foundRecipes = [];


        // Maximal 5 Vorratszutaten verwenden.
        const maximumIngredients =
            Math.min(
                pantryNames.length,
                5
            );


        // Für jede Vorratszutat
        // Online-Rezepte suchen.
        for (
            let i = 0;
            i < maximumIngredients;
            i++
        ) {

            const ingredient =
                pantryNames[i];


            const url =
                'https://www.themealdb.com/api/json/v1/1/filter.php?i=' +
                encodeURIComponent(
                    ingredient
                );


            const response =
                await fetch(url);


            if (!response.ok) {
                continue;
            }


            const data =
                await response.json();


            if (!data.meals) {
                continue;
            }


            // Doppelte Rezepte vermeiden.
            for (const meal of data.meals) {

                let alreadyExists = false;


                for (
                    const existingRecipe
                    of foundRecipes
                ) {

                    if (
                        existingRecipe.idMeal ===
                        meal.idMeal
                    ) {

                        alreadyExists = true;
                    }
                }


                if (!alreadyExists) {

                    foundRecipes.push(
                        meal
                    );
                }
            }
        }


        // Wir laden maximal 10 Rezepte.
        const recommendations = [];


        const maximumRecipes =
            Math.min(
                foundRecipes.length,
                10
            );


        for (
            let i = 0;
            i < maximumRecipes;
            i++
        ) {

            const recipe =
                foundRecipes[i];


            // Vollständiges Rezept laden.
            const detailUrl =
                'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' +
                recipe.idMeal;


            const detailResponse =
                await fetch(
                    detailUrl
                );


            if (!detailResponse.ok) {
                continue;
            }


            const detailData =
                await detailResponse.json();


            if (
                !detailData.meals ||
                detailData.meals.length === 0
            ) {
                continue;
            }


            const meal =
                detailData.meals[0];


            const recipeIngredients =
                getRecipeIngredients(
                    meal
                );


            const checkedIngredients = [];

            let matchedIngredients = 0;


            // Rezeptzutaten mit Vorrat vergleichen.
            for (
                const recipeIngredient
                of recipeIngredients
            ) {

                const recipeName =
                    recipeIngredient.name
                        .trim()
                        .toLowerCase();


                let available = false;


                for (
                    const pantryName
                    of pantryNames
                ) {

                    if (
                        recipeName.includes(
                            pantryName
                        ) ||
                        pantryName.includes(
                            recipeName
                        )
                    ) {

                        available = true;
                    }
                }


                if (available) {

                    matchedIngredients =
                        matchedIngredients + 1;
                }


                checkedIngredients.push({
                    name:
                        recipeIngredient.name,

                    measure:
                        recipeIngredient.measure,

                    available:
                        available
                });
            }


            const totalIngredients =
                checkedIngredients.length;


            let matchPercent = 0;


            if (totalIngredients > 0) {

                matchPercent =
                    Math.round(
                        matchedIngredients /
                        totalIngredients *
                        100
                    );
            }


            let category =
                'nicht kochbar';


            if (
                matchPercent === 100
            ) {

                category =
                    'kochbar';

            } else if (
                matchPercent >= 50
            ) {

                category =
                    'fast kochbar';
            }


            const missingIngredients = [];


            for (
                const ingredient
                of checkedIngredients
            ) {

                if (!ingredient.available) {

                    missingIngredients.push(
                        ingredient
                    );
                }
            }


            const recommendation = {

                id:
                    meal.idMeal,

                title:
                    meal.strMeal,

                image:
                    meal.strMealThumb,

                instructions:
                    meal.strInstructions,

                sourceUrl:
                    meal.strSource
                        ? meal.strSource
                        : '',

                youtube:
                    meal.strYoutube
                        ? meal.strYoutube
                        : '',

                matchPercent:
                    matchPercent,

                category:
                    category,

                totalIngredients:
                    totalIngredients,

                matchedIngredients:
                    matchedIngredients,

                ingredients:
                    checkedIngredients,

                missingIngredients:
                    missingIngredients
            };


            recommendations.push(
                recommendation
            );
        }


        // Beste Treffer zuerst sortieren.
        recommendations.sort(
            (a, b) =>
                b.matchPercent -
                a.matchPercent
        );


        res.status(200);
        res.send(
            recommendations
        );

    } catch (error) {

        console.error(
            'Fehler bei Online-Rezepten:',
            error.message
        );


        res.status(500);

        res.send({
            error:
                'Online-Rezepte konnten nicht geladen werden.'
        });
    }
});


module.exports = router;