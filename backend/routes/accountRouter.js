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

router.post("/updateAdress", async (req, res) => {
	try {
		if (!res.locals.loggedInUser || !res.locals.loggedInUser._id) {
			return res.redirect("/login");
		}
		const user = await User.findById(res.locals.loggedInUser._id);
		if (!user) {
			throw new Error("User not found");
		}
		if (!user.address) {
			user.address = [];
		}
		const addresses = req.body.address;
		if (!Array.isArray(addresses)) {
			return res.status(400).json({ message: "Invalid address data" });
		}
		user.address = addresses;
		await user.save();
		res.status(200).json({ message: "Adresses updated successfully" });
	} catch (error) {
		res.status(500).send("Server Error");
	}
});

router.post("/deleteAddress", async (req, res) => {
	try {
		if (!res.locals.loggedInUser || !res.locals.loggedInUser._id) {
			return res.redirect("/login");
		}
		const user = await User.findById(res.locals.loggedInUser._id);
		if (!user) {
			throw new Error("User not found");
		}
		const index = Number(req.body.index);
		if (
			typeof index !== "number" ||
			index < 0 ||
			index >= user.address.length
		) {
			return res.status(400).json({ message: "Invalid address index" });
		}
		user.address.splice(index, 1);
		await user.save();

		res.status(200).json({ message: "Address deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).send("Server Error");
	}
});

router.post("/makeDefault", async (req, res) => {
	try {
		if (!res.locals.loggedInUser || !res.locals.loggedInUser._id) {
			return res.redirect("/login");
		}
		const user = await User.findById(res.locals.loggedInUser._id);
		if (!user) {
			throw new Error("User not found");
		}
		const index = Number(req.body.index);
		if (
			typeof index !== "number" ||
			index < 0 ||
			index >= user.address.length
		) {
			return res.status(400).json({ message: "Invalid address index" });
		}
		let temp = user.address[0];
		user.address[0] = user.address[index];
		user.address[index] = temp;

		await user.save();
		res.status(200).json({ message: "Adresses updated successfully" });
	} catch (error) {
		res.status(500).send("Server Error");
	}
});

module.exports = router;
