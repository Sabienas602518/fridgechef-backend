const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,
    quantity: Number,
    unit: String,
    category: String,
    expiryDate: Date
});

module.exports = mongoose.model('Ingredient', schema);