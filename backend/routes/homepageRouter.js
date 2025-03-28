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
		const products = await Product.find();
		const userId = res.locals.loggedInUser._id;
		const cartItems = await Cart.find({ userId });
		const page_title = "TisDif e-Card | Home";
		res.render("index.ejs", {
			products: products,
			cartItems: cartItems,
			page_title,
			slides: res.locals.slides,
		});
	} catch (error) {
		res.status(500).send("Error fetching products.");
	}
});

module.exports = router;
