const express = require("express");
const Cart = require("../models/Cart");
const { checkLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

// ➤ Add product to cart
router.post("/add-to-cart", checkLogin, async (req, res) => {
	try {
		if (!res.locals.loggedInUser || !res.locals.loggedInUser._id) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const userId = res.locals.loggedInUser._id;
		const { productId, total_price, selected_quantity } = req.body;

		if (!productId || !total_price || !selected_quantity) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		// Create a new cart item
		const cartItem = new Cart({
			userId,
			productId,
			total_price,
			selected_quantity,
			orderDate: new Date(),
		});

		// Save cart item
		await cartItem.save();
		res.status(200).json({ message: "Item added to cart", cartItem });
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
});

// ➤ Get logged-in user's cart items
router.get("/", async (req, res) => {
	try {
		if (!res.locals.loggedInUser || !res.locals.loggedInUser._id) {
			return res.redirect("/login");
		}

		const userId = res.locals.loggedInUser._id;

		// Fetch cart items with product details
		const cartItems = await Cart.find({ userId }).populate("productId");
		const page_title = "TisDif e-Card | Cart";
		res.render("cart", { cartItems, page_title });
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
});

// POST /cart/:id/delete
router.post("/:id/delete", checkLogin, async (req, res) => {
	try {
		const userId = res.locals.loggedInUser._id;
		const cartId = req.params.id;

		const cartItem = await Cart.findOne({ _id: cartId, userId });
		if (!cartItem) {
			return res.redirect("/cart");
		}
		await Cart.deleteOne({ _id: cartId });
		return res.redirect("/cart");
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;
