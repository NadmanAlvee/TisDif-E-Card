const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { checkLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

router.get("/", checkLogin, async (req, res) => {
	try {
		if (!res.locals.loggedInUser || !res.locals.loggedInUser._id) {
			return res.redirect("/login");
		}

		const user = res.locals.loggedInUser;
		const userId = user._id;

		const [cartItems, orders] = await Promise.all([
			Cart.find({ userId }).populate("productId"),
			Order.find({ user: userId }).populate("items.product"),
		]);

		res.render("account", {
			user,
			orders,
			cartItems,
		});
	} catch (error) {
		console.error("Error fetching account details:", error);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
