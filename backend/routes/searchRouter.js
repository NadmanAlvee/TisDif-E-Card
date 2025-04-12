const express = require("express");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const searchSanitizer = require("../middlewares/utils/searchSanitizer");

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		let query = searchSanitizer(req.query.searchQuery);
		const offers = searchSanitizer(req.query.offers);
		let finds;
		if (offers === "true" && (query === null || query === "")) {
			finds = await Product.find({
				saveTag: { $gt: 0 },
				stock: { $gt: 0 },
			}).exec();
			query = "offers";
		} else if (query === null) {
			finds = await Product.find();
		} else {
			finds = await Product.find({
				$or: [
					{ name: new RegExp(query, "i") },
					{ category: new RegExp(query, "i") },
				],
			}).exec();
		}
		const page_title = `Search result of ${query}`;
		if (!res.locals.loggedInUser || !res.locals.loggedInUser._id) {
			const cartCookie = req.signedCookies[process.env.CART_NAME];
			const cartItems = cartCookie ? JSON.parse(cartCookie) : [];
			if (finds.length > 0) {
				res.render("search", {
					finds,
					cartItems,
					page_title,
					query,
				});
			} else {
				res.render("search", {
					cartItems,
					page_title,
					query,
				});
			}
		} else {
			const userId = res.locals.loggedInUser._id;
			const cartItems = await Cart.find({ userId: userId }).populate(
				"productId"
			);
			if (finds.length > 0) {
				res.render("search", {
					finds,
					cartItems,
					page_title,
					query,
				});
			} else {
				res.render("search", {
					cartItems,
					page_title,
					query,
				});
			}
		}
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
