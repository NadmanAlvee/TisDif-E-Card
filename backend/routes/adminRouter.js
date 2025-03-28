const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

// Get all products
router.get("/", async (req, res) => {
	try {
		const products = await Product.find();
		res.render("admin/manageProducts", { products });
	} catch (err) {
		res.status(500).send("Error fetching products");
	}
});

// users route
router.get("/orders", async (req, res) => {
	try {
		const orders = await Order.find().populate("items.product").exec();
		const users = await User.find();
		res.render("admin/manageOrders", { orders, users });
	} catch (error) {
		res.status(500).send("Error loading orders");
	}
});

// update order state
router.put("/update-order-status/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		await Order.findByIdAndUpdate(id, { status });
		res.status(200).json({ message: "Order status updated successfully" });
	} catch (err) {
		res.status(500).json({ message: "Error updating order status" });
	}
});

// Add a new product
router.post("/add-product", async (req, res) => {
	try {
		const { name, price, description, image, category, stock, saveTag } =
			req.body;

		const imageArray = image.split(",").map((img) => img.trim());

		const newProduct = new Product({
			name,
			price,
			description,
			image: imageArray,
			category,
			stock,
			saveTag,
		});

		await newProduct.save();
		res.redirect("/admin");
	} catch (err) {
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
