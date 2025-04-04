const express = require("express");
const Product = require("../models/Product"); // Import the Product model
const Cart = require("../models/Cart");
const router = express.Router();

const mongoose = require("mongoose");

// Get a single product and render the EJS page
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		// Validate ObjectId before querying
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.redirect("/");
		}
		const product = await Product.findById(id);
		if (!product) {
			return res.redirect("/nofound");
		}

		const userId = res.locals.loggedInUser._id;
		const cartItems = await Cart.find({ userId });

		// Fetch related products (excluding the current product)
		const relatedProducts = await Product.find({
			_id: { $ne: id },
			category: product.category,
		});

		const page_title = `${product.name} price in Bangladesh`;
		res.render("product-details", {
			product,
			relatedProducts,
			cartItems,
			page_title,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Get a single product
router.get("/api/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		// Fetch related products (excluding current product)
		const relatedProducts = await Product.find({
			_id: { $ne: id },
			category: product.category,
		});

		res.json({ product, relatedProducts });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
