const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
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
		console.error("Error adding to cart:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

// ➤ Get logged-in user's cart items
router.get("/", checkLogin, async (req, res) => {
	try {
		if (!res.locals.loggedInUser || !res.locals.loggedInUser._id) {
			return res.redirect("/login"); // Redirect to login if not logged in
		}

		const userId = res.locals.loggedInUser._id;

		// Fetch cart items with product details
		const cartItems = await Cart.find({ userId }).populate("productId");

		res.render("cart", { cartItems });
	} catch (error) {
		console.error("Error loading cart:", error);
		res.status(500).send("Internal Server Error");
	}
});

// delete cart item
router.delete("/:id", checkLogin, async (req, res) => {
	try {
		if (!res.locals.loggedInUser || !res.locals.loggedInUser._id) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const userId = res.locals.loggedInUser._id;
		const cartId = req.params.id;

		// Find the cart item
		const cartItem = await Cart.findOne({ _id: cartId, userId });

		if (!cartItem) {
			return res.status(404).json({ message: "Cart item not found" });
		}

		// Delete the cart item
		await Cart.deleteOne({ _id: cartId });

		res.status(200).json({ message: "Item removed from cart" });
	} catch (error) {
		console.error("Error removing cart item:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;
