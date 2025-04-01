const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const createHttpError = require("http-errors");
const checkoutDetails = require("../middlewares/utils/checkoutDetails");

router.post("/checkout", async (req, res) => {
	try {
		const userId = res.locals.loggedInUser._id;
		if (!userId) return res.redirect("/login");

		const {
			user,
			cartItems,
			grand_total,
			point_possible,
			delivery_charge,
			total_after_discount,
		} = await checkoutDetails(userId);

		const use_Points = req.body.use_Points === "yes";
		const pointsToDeduct = use_Points ? Math.min(user.points, grand_total) : 0;
		const totalAmount = grand_total - pointsToDeduct;

		// Create order items array
		const orderItems = cartItems.map((item) => ({
			product: item.productId._id,
			quantity: item.selected_quantity,
			price: item.productId.price,
		}));

		// Create order
		const order = new Order({
			user: user._id,
			items: orderItems,
			totalAmount: totalAmount,
			point_possible: point_possible,
			given_point: 0,
			delivery_charge: delivery_charge,
			pointsUsed: pointsToDeduct,
			paymentMethod: "Online Payment",
			deliveryMethod: "Home Delivery",
			customerInfo: {
				fullName: req.body.order_fullName,
				mobile: req.body.order_mobile,
				email: req.body.order_email,
				address: req.body.order_address,
			},
		});

		// Save order and clear cart
		await order.save();
		await Cart.deleteMany({ userId: user._id });

		// Update user points and order history
		await User.findByIdAndUpdate(user._id, {
			$inc: { points: -pointsToDeduct },
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
		const order = await Order.findOne({
			_id: orderId,
			user: userId,
		});
		if (!order) {
			throw createHttpError("An error occurred!");
		}
		const itemToRemove = order.items.find(
			(item) => item._id.toString() === itemId
		);
		if (!itemToRemove) {
			throw createHttpError("Item not found in order");
		}
		// Remove the item and update total
		await Order.findByIdAndUpdate(orderId, {
			$pull: { items: { _id: itemId } },
			$inc: { totalAmount: -(itemToRemove.quantity * itemToRemove.price) },
		});
		const updatedOrder = await Order.findById(orderId);
		if (updatedOrder.items.length === 0) {
			if (order.pointsUsed && order.pointsUsed > 0) {
				await User.findByIdAndUpdate(userId, {
					$inc: { points: order.pointsUsed },
				});
			}
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
					msg: error.message,
				},
			},
		});
	}
});

router.put("/update_pts/:id", async (req, res) => {
	const order_id = req.params.id;
	const requestedOrder = await Order.findById(order_id);
	if (!requestedOrder)
		return res.status(404).json({ message: "Order not found" });
	try {
		const points = Number(req.body.point_possible);
		if (isNaN(points)) {
			return res.status(400).json({ message: "Invalid points" });
		}
		await Order.findByIdAndUpdate(order_id, {
			$inc: {
				given_point: points,
				point_possible: -points,
			},
		});
		return res.sendStatus(200);
	} catch (err) {
		console.error(err);
		return res.status(500).send("An error occurred");
	}
});

module.exports = router;
