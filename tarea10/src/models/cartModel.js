const mongoose = require("mongoose");

const cartsCollection = 'carts';

const CartSchema = new mongoose.Schema({
    name: {type: String, required: true},
    id: {type: Number, required: true},
    products:[{
        id:{type: Number, required: true},
        quantity:{type: Number, required: true}
    }]
})

const carts = mongoose.model(cartsCollection, CartSchema);

module.exports = carts