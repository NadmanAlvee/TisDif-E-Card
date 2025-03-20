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

// POST /cart/:id/delete
router.post("/:id/delete", checkLogin, async (req, res) => {
	try {
		const userId = res.locals.loggedInUser._id;
		const cartId = req.params.id;

		const cartItem = await Cart.findOne({ _id: cartId, userId });
		if (!cartItem) {
			return res.status(404).json({ message: "Cart item not found" });
		}

		await Cart.deleteOne({ _id: cartId });
		return res.redirect("/cart");
	} catch (error) {
		console.error("Error removing cart item:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

// ➤ Checkout Route (keep existing routes unchanged)
router.post("/checkout", checkLogin, async (req, res) => {
	try {
		const user = res.locals.loggedInUser;

		// 1. Get user's cart items
		const cartItems = await Cart.find({ userId: user._id }).populate(
			"productId"
		);

		const totalAmount = cartItems.reduce(
			(sum, item) => sum + item.productId.price * item.selected_quantity,
			0
		);

		// 3. Create order using existing cart items
		const order = new Order({
			user: user._id,
			cartItems: cartItems.map((item) => item._id), // Reference cart items
			totalAmount,
			paymentMethod: req.body.paymentMethod,
		});

		await order.save();

		res.redirect("/order-confirmation");
	} catch (error) {
		console.error("Checkout error:", error);
		res.status(500).send("Checkout failed");
	}
});

module.exports = router;
