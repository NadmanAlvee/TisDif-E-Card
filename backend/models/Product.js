const mongoose = require("mongoose");
const slugify = require("slugify");

const ProductSchema = new mongoose.Schema({
	slug: { type: String, unique: true },
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
		default: 0,
	},
	varient: {
		type: String,
		default: "",
	},
	description: {
		type: String,
		default: "",
	},
	image: [String], // an array of string
	category: {
		type: String,
		required: true,
		enums: ["iphones", "giftcards", "accessories"],
	},
	stock: {
		type: Number,
		default: 0,
	},
	saveTag: {
		type: Number,
		default: 0,
	},
	pointsPossible: {
		type: Number,
		default: 0,
	},
});

// Slug generation hook
ProductSchema.pre("save", function (next) {
	if (!this.slug && this.name) {
		this.slug = slugify(this.name, { lower: true, strict: true });
	}
	next();
});

module.exports = mongoose.model("Product", ProductSchema);
