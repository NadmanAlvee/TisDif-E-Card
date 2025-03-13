const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// GET /checkout - Render the checkout page
router.get("/", async (req, res) => {
	try {
		// Make sure user is logged in
		if (!res.locals.loggedInUser) {
			return res.redirect("/login");
		}

		// Fetch cart items
		const userId = res.locals.loggedInUser._id;
		const cartItems = await Cart.find({ userId }).populate("productId");

		// Render the checkout page with cart items
		res.render("checkout", { cartItems });
	} catch (error) {
		console.error("Error loading checkout page:", error);
		res.status(500).send("Server Error");
	}
});

// POST /checkout - Confirm the order
router.post("/", async (req, res) => {
	try {
		if (!res.locals.loggedInUser) {
			return res.redirect("/login");
		}
		// Example: console.log the form data
		console.log("Checkout form data:", req.body);

		// Redirect to account (or your confirmation page)
		res.redirect("/account");
	} catch (error) {
		console.error("Error confirming order:", error);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
