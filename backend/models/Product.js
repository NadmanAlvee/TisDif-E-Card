const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
		default: 0,
	},
	description: {
		type: String,
		default: "",
	},
	image: [String], // an array of images
	category: {
		type: String,
		required: true,
		enums: ["iphones", "airpods", "giftcards", "accessories"],
		default: "iphones",
	},
	stock: {
		type: Number,
		default: 0,
	},
	saveTag: {
		type: Number,
		default: 0,
	},
});

module.exports = mongoose.model("Product", ProductSchema);
