const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

// product management page routing
router.get("/products", async (req, res) => {
	try {
		const products = await Product.find();
		res.render("admin/manageProducts", { products, page_title: "Products" });
	} catch (err) {
		res.status(500).json({ message: "An error occured" });
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
		res.status(500).json({ message: "An error occured" });
	}
});
// Update stock
router.put("/update/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { stock, price, saveTag } = req.body;
		await Product.findByIdAndUpdate(id, { stock, price, saveTag });
		res.status(200).json({ message: "Product updated successfully" });
	} catch (err) {
		res.status(500).json({ message: "Error updating stock" });
	}
});
// Delete Product
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		await Product.findByIdAndDelete(id);
		res.status(200).json({ message: "Product deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: "Error deleting product" });
	}
});

// user management page routing
router.get("/users", async (req, res) => {
	try {
		const users = await User.find();
		res.render("admin/manageUsers", { users, page_title: "Users" });
	} catch (err) {
		res.status(500).json({ message: "An error occured" });
	}
});
// Update loyalty points
router.put("/users/update_pts", async (req, res) => {
	try {
		const { id, points } = req.body;
		// Validate input
		if (!id || !points || isNaN(Number(points))) {
			return res.status(400).json({ message: "Invalid Input" });
		}
		await User.findByIdAndUpdate(id, {
			points: parsedPoints,
		});
		res.status(200).json({ message: "User points updated" });
	} catch (err) {
		res.status(500).json({ message: "An error occurred" });
	}
});

// order management page routing
router.get("/orders", async (req, res) => {
	try {
		const orders = await Order.find().populate("items.product").exec();
		const users = await User.find();
		res.render("admin/manageOrders", { orders, users, page_title: "Orders" });
	} catch (err) {
		res.status(500).json({ message: "An error occured" });
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

module.exports = router;
