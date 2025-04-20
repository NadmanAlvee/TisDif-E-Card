// external imports
const express = require("express");

// internal imports
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// configs
const router = express.Router();

// homepage route
router.get("/", async (req, res) => {
	const page_title =
		"TISDIF E-CARD | Authentic Apple Accessories in Bangladesh";
	const products = await Product.find();
	if (!res.locals.loggedInUser || !res.locals.loggedInUser._id) {
		try {
			const cartCookie = req.signedCookies[process.env.CART_NAME];
			const cartItems = cartCookie ? JSON.parse(cartCookie) : [];
			const populatedItems = await Promise.all(
				cartItems.map(async (item) => {
					const product = await Product.findById(item.productId);
					if (!product) return null;
					return {
						productId: product,
						total_price: item.total_price,
						selected_quantity: item.selected_quantity,
					};
				})
			);
			const validItems = populatedItems.filter((item) => item !== null);
			res.render("index.ejs", {
				products: products,
				cartItems: validItems,
				page_title,
				slides: res.locals.slides,
			});
		} catch (error) {
			res.status(500).send("Error fetching products.");
		}
	} else {
		try {
			const userId = res.locals.loggedInUser._id;
			const cartItems = await Cart.find({ userId });
			res.render("index.ejs", {
				products: products,
				cartItems: cartItems,
				page_title,
				slides: res.locals.slides,
			});
		} catch (error) {
			res.status(500).send("Error fetching products.");
		}
	}
});

module.exports = router;
