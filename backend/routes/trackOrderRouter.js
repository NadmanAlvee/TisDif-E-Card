const express = require("express");
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const page_title = "Track Order | Tisdif";
		if (!res.locals.loggedInUser || !res.locals.loggedInUser._id) {
			const cartCookie = req.signedCookies[process.env.CART_NAME];
			const cartItems = cartCookie ? JSON.parse(cartCookie) : [];

			res.render("trackOrder.ejs", {
				page_title,
				cartItems,
				order: null,
			});
		} else {
			const userId = res.locals.loggedInUser._id;
			const cartItems = await Cart.find({ userId });

			res.render("trackOrder.ejs", {
				page_title,
				cartItems,
				order: null,
			});
		}
	} catch (error) {
		res.status(500).send("Server Error");
	}
});

router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ error: "Invalid order ID format." });
		}
		const order = await Order.findById(id)
			.populate("user")
			.populate("items.product");
		if (!order) {
			return res.status(404).json({ error: "Order not found." });
		}
		res.status(200).json(order);
	} catch (error) {
		res.status(500).send("Server Error");
	}
});

module.exports = router;
