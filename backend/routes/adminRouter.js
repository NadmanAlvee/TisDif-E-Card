const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const multiUploader = require("../middlewares/utils/multiUploader");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
router.use(express.urlencoded({ extended: true }));

// product management page routing
router.get("/products", async (req, res) => {
	try {
		const products = await Product.find();
		res.render("admin/manageProducts", { products, page_title: "Products" });
	} catch (err) {
		res.status(500).json({ message: "An error occured" });
	}
});
// add new product
router.post(
	"/add-product",
	multiUploader.array("productImageArray", 8),
	async (req, res) => {
		try {
			const {
				productName,
				productPrice,
				productVarient,
				productDescription,
				productCategory,
				productStock,
				productSaveTag,
			} = req.body;
			const imageFilenames = req.files.map((file) => {
				return `/images/products/${productCategory}/${file.filename}`;
			});
			// Create new product instance
			const newProduct = new Product({
				name: productName,
				price: productPrice,
				varient: productVarient,
				description: productDescription,
				category: productCategory,
				stock: productStock,
				saveTag: productSaveTag,
				image: imageFilenames,
			});
			await newProduct.save();
			res.status(200).json({ message: "Product created successfully" });
		} catch (err) {
			res.status(500).json({ message: "An error occurred." });
		}
	}
);
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
		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}
		const productImages = product.image || [];
		// Promise.all() to wait for each promise to resolve
		await Promise.all(
			productImages.map(async (image) => {
				try {
					await fs.promises.unlink(
						path.join(__dirname, "../../public/", image)
					);
				} catch (err) {
					console.error(`Failed to delete image ${image}:`, err);
				}
			})
		);
		// Delete product from database
		await Product.findByIdAndDelete(id);
		res.status(200).json({ message: "Product deleted successfully" });
	} catch (err) {
		console.error("Error deleting product:", err);
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
