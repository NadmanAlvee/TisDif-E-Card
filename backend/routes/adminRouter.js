const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const multiUploader = require("../middlewares/utils/multiUploader");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const transporter = require("../middlewares/utils/transporter");
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
				productPoints,
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
				pointsPossible: productPoints,
			});
			await newProduct.save();
			res.status(200).json({ message: "Product created successfully" });
		} catch (err) {
			res.status(500).json({ message: "An error occurred." });
		}
	}
);
// add new image
router.post(
	"/product/add-product-image",
	multiUploader.array("productImageUpdate", 8),
	async (req, res) => {
		try {
			const { productId, productCategory } = req.body;
			const imageFilenames = req.files.map((file) => {
				return `/images/products/${productCategory}/${file.filename}`;
			});
			await Product.findByIdAndUpdate(productId, {
				$push: { image: { $each: imageFilenames } },
			});
			res.redirect("/admin/products");
		} catch (err) {
			res.status(500).json({ message: "An error occurred." });
		}
	}
);
// delete product image
router.delete("/product/delete-product-image", async (req, res) => {
	try {
		const { productId, imageUrl } = req.body;
		await Product.findByIdAndUpdate(productId, {
			$pull: { image: imageUrl },
		});
		const filePath = path.join(__dirname, "../../public", imageUrl);
		fs.unlink(filePath, (err) => {
			if (err) {
				console.error("Failed to delete file:", err);
			}
		});
		res.status(200).json({ message: "Image deleted successfully" });
	} catch (err) {
		console.error("Error deleting image:", err);
		res.status(500).json({ message: "An error occurred." });
	}
});

// Update Product Info
router.put("/update/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { stock, price, saveTag, pointsPossible } = req.body;
		await Product.findByIdAndUpdate(id, {
			stock,
			price,
			saveTag,
			pointsPossible,
		});
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
		const { id, parsedPoints } = req.body;
		if (!id || parsedPoints === undefined || isNaN(Number(parsedPoints))) {
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
		const orders = await Order.find().populate("items.product");
		const users = await User.find();
		res.render("admin/manageOrders", {
			orders,
			users,
			page_title: "Orders",
		});
	} catch (err) {
		res.status(500).json({ message: "An error occured" });
	}
});
// update order state
router.put("/update-order-status/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
			.populate("user")
			.populate("items.product");

		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}
		// Send email only for specific statuses
		if (["Confirmed", "Shipped", "Delivered"].includes(status)) {
			const mailOptions = {
				from: process.env.EMAIL_USER,
				to: order.user.email,
				subject: `Your Order is ${status}! - TisdifeCard`,
				html: `
			<h2>Thank you for your order!</h2>
			<p>Order ID: #${order._id}</p>
			<p><strong>Order Details:</strong></p>
			${order.items
				.map(
					(item) =>
						`${item.product.name} - ${item.quantity} x ${item.price} BDT`
				)
				.join("")}
			<p>Total Amount: <strong>${order.totalAmount.toFixed(2)}</strong> BDT</p>
			<p>Thank you for trusting TisdifeCard!</p>
		  `,
			};
			await transporter.sendMail(mailOptions);
			console.log(`Main sent to: ${order.user.email}`);
		}
		res.status(200).json({ message: "Order status updated successfully" });
	} catch (err) {
		console.error("Error updating order status:", err);
		res.status(500).json({ message: "Error updating order status" });
	}
});

module.exports = router;
