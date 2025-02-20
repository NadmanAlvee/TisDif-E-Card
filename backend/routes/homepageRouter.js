// external imports
const express = require("express");

// internal imports
const Product = require("../models/Product");

// configs
const router = express.Router();

// homepage route
router.get("/", async (req, res) => {
	try {
		const products = await Product.find(); // Fetch all products from the database
		// Pass products to the EJS view
		res.render("index.ejs", {
			products: products,
			loggedInUser: res.locals.loggedInUser || {},
		});
	} catch (error) {
		console.error("Error fetching products:", error);
		res.status(500).send("Error fetching products.");
	}
});

module.exports = router;
