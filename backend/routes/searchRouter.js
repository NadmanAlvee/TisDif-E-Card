const express = require("express");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const searchSanitizer = require("../middlewares/utils/searchSanitizer");

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const userId = res.locals.loggedInUser._id;
		const cartItems = await Cart.find(userId).populate("productId");
		const query = searchSanitizer(req.query.searchQuery);
		let finds;
		if (query === null) {
			finds = await Product.find(); // display all products
		} else {
			finds = await Product.find({
				$or: [
					{ name: new RegExp(query, "i") },
					{ category: new RegExp(query, "i") },
				],
			}).exec();
		}
		if (finds.length > 0) {
			const page_title = `Search result of ${query}`;
			res.render("search", {
				finds,
				cartItems,
				page_title,
				query,
			});
		} else {
			const page_title = `Search result of ${query}`;
			res.render("search", {
				cartItems,
				page_title,
				query,
			});
		}
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
