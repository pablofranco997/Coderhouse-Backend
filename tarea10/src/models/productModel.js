const mongoose = require("mongoose");

const productsCollection = 'products';

const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    id: {type: Number, required: true}
})

const products = mongoose.model(productsCollection, ProductSchema);

module.exports = products