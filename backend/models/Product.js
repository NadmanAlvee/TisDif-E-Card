const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    image: [String], // An array of URL or filename 
    category: String,
    stock: {
        type: Number,
        default: 0

    },
});

module.exports = mongoose.model('Product', ProductSchema);
