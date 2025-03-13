// external imports
const express = require("express");

// internal imports
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// configs
const router = express.Router();

// homepage route
router.get("/", async (req, res) => {
	try {
		const products = await Product.find(); // Fetch all products from the database
		const userId = res.locals.loggedInUser._id;
		const cartItems = await Cart.find({ userId }).populate("productId");

		res.render("index.ejs", {
			products: products,
			cartItems: cartItems,
		});
	} catch (error) {
		console.error("Error fetching products:", error);
		res.status(500).send("Error fetching products.");
	}
});

module.exports = router;
