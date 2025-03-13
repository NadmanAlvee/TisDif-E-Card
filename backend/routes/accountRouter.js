const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { checkLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

// Account Page Route
router.get("/", checkLogin, async (req, res) => {
	try {
		const user = res.locals.loggedInUser;
		const userId = res.locals.loggedInUser._id;

		const cartItems = await Cart.find({ userId }).populate("productId");
		// Fetch the user's orders
		const orders = await Order.find({ userId }).sort({
			createdAt: -1,
		});
		res.render("account", { user, orders, cartItems });
	} catch (error) {
		console.error("Error fetching account details:", error);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
