const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");

// GET /checkout - Keep existing but add delivery method
router.get("/", async (req, res) => {
	try {
		if (!res.locals.loggedInUser) return res.redirect("/login");

		const userId = res.locals.loggedInUser._id;
		const cartItems = await Cart.find({ userId }).populate("productId");

		if (cartItems.length === 0) return res.redirect("/cart");

		res.render("checkout", {
			cartItems,
			user: res.locals.loggedInUser, // Pre-fill user info
		});
	} catch (error) {
		console.error("Checkout error:", error);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
