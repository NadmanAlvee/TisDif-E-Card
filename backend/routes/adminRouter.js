const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // Import your Mongoose Product model

// Get all products
router.get("/", async (req, res) => {
	try {
		const products = await Product.find(); // Fetch all products
		res.render("adminPortal", { products });
	} catch (err) {
		res.status(500).send("Error fetching products");
	}
});

// Add a new product
router.post("/add-product", async (req, res) => {
	try {
		const { name, price, description, image, category, stock, saveTag } =
			req.body;

		// Convert image string into an array
		const imageArray = image.split(",").map((img) => img.trim());

		const newProduct = new Product({
			name,
			price,
			description,
			image: imageArray, // Ensure it's stored as an array
			category,
			stock,
			saveTag,
		});

		await newProduct.save();
		res.redirect("/admin"); // Refresh the product list
	} catch (err) {
		console.error(err);
		res.status(500).send("Error adding product");
	}
});

// Update stock
router.put("/update/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { stock, price } = req.body;
		await Product.findByIdAndUpdate(id, { stock, price });
		res.status(200).json({ message: "Stock updated successfully" });
	} catch (err) {
		res.status(500).json({ message: "Error updating stock" });
	}
});

// Delete Product
router.delete("/delete/:id", async (req, res) => {
	try {
		const { id } = req.params;
		await Product.findByIdAndDelete(id);
		res.status(200).json({ message: "Product deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: "Error deleting product" });
	}
});

module.exports = router;
