const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const createHttpError = require("http-errors");

router.post("/checkout", async (req, res) => {
	try {
		const user = res.locals.loggedInUser;
		if (!user) return res.redirect("/login");

		// Get cart items
		const cartItems = await Cart.find({ userId: user._id }).populate(
			"productId"
		);

		// Create order items array
		const orderItems = cartItems.map((item) => ({
			product: item.productId._id,
			quantity: item.selected_quantity,
			price: item.productId.price,
		}));

		// Calculate total
		const totalAmount = cartItems.reduce(
			(total, item) => total + item.productId.price * item.selected_quantity,
			0
		);

		// Create order
		const order = new Order({
			user: user._id,
			items: orderItems,
			totalAmount,
			paymentMethod: "Online Payment",
			deliveryMethod: "Home Delivery",
			customerInfo: {
				fullName: req.body.fullName,
				mobile: req.body.mobile,
				email: req.body.email,
				address: req.body.address,
			},
		});

		// Save order and clear cart
		await order.save();
		await Cart.deleteMany({ userId: user._id });

		// Update user with order history
		await User.findByIdAndUpdate(user._id, {
			$push: { orders: order._id },
		});
		res.redirect(`/account`);
	} catch (error) {
		res.status(500).send("Order processing failed");
	}
});

router.post("/:orderId/items/:itemId/delete", async (req, res) => {
	try {
		const userId = res.locals.loggedInUser._id;
		const { orderId, itemId } = req.params;

		// 1. Verify order ownership
		const order = await Order.findOne({
			_id: orderId,
			user: userId,
		});

		if (!order) {
			throw createHttpError("an error occured!");
		}

		// 2. Find the item to remove
		const itemToRemove = order.items.find(
			(item) => item._id.toString() === itemId
		);

		if (!itemToRemove) {
			throw createHttpError("Item not found in order");
		}

		// 3. Remove the item and update total
		await Order.findByIdAndUpdate(orderId, {
			$pull: { items: { _id: itemId } },
			$inc: { totalAmount: -(itemToRemove.quantity * itemToRemove.price) },
		});

		// 4. Check if order becomes empty
		const updatedOrder = await Order.findById(orderId);
		if (updatedOrder.items.length === 0) {
			await Order.findByIdAndDelete(orderId);
		}
		res.redirect("/account");
	} catch (error) {
		const user = res.locals.loggedInUser;
		const userId = res.locals.loggedInUser._id;
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
			errors: {
				common: {
					msg: err.message,
				},
			},
		});
	}
});

module.exports = router;
