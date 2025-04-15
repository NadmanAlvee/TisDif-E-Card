const express = require("express");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { default: mongoose } = require("mongoose");
const router = express.Router();

router.get("/:id", async (req, res) => {
	try {
		const page_title = "Track Order | Tisdif";
		if (req.params.id != null) {
		}
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

router.post("/", async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.body.orderQuery)) {
			return null;
		}
		const OrderId = req.body.orderQuery;
		const response = await Order.findById(OrderId).populate("user");

		res.status(200).json(response);
	} catch (error) {
		res.status(500).send("Server Error");
	}
});

module.exports = router;
