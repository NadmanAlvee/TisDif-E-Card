const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// GET /checkout
router.get("/", async (req, res) => {
	try {
		if (!res.locals.loggedInUser) return res.redirect("/login");

		const userId = res.locals.loggedInUser._id;
		const cartItems = await Cart.find({ userId }).populate("productId");

		if (cartItems.length === 0) return res.redirect("/cart");
		const page_title = "TisDif e-Card | Checkout";
		res.render("checkout", {
			cartItems,
			user: res.locals.loggedInUser, // Pre-fill user info
			page_title,
		});
	} catch (error) {
		console.error("Checkout error:", error);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
