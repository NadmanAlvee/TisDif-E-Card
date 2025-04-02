const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		if (!res.locals.loggedInUser || !res.locals.loggedInUser._id) {
			return res.redirect("/login");
		}

		const user = await User.findById(res.locals.loggedInUser._id);
		const userId = user._id;
		const [cartItems, orders] = await Promise.all([
			Cart.find({ userId }).populate("productId"),
			Order.find({ user: userId }).populate("items.product"),
		]);
		const page_title = "TisDif e-Card | Account";
		res.render("account", {
			user,
			orders,
			cartItems,
			page_title,
		});
	} catch (error) {
		res.status(500).send("Server Error");
	}
});

module.exports = router;
