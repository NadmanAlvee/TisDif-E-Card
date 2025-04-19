const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const createHttpError = require("http-errors");
const checkoutDetails = require("../middlewares/utils/checkoutDetails");
const transporter = require("../middlewares/utils/transporter");

router.post("/checkout", async (req, res) => {
	if (!res.locals.loggedInUser || !res.locals.loggedInUser._id) {
		try {
			const response = await checkoutDetails(req, res);
			if (response === null) {
				res.redirect("/cart");
				return;
			}
			const { cartItems, grand_total, delivery_charge } = response;
			// Create order items array
			const orderItems = cartItems.map((item) => ({
				product: item.productId._id,
				quantity: item.selected_quantity,
				price: item.productId.price,
			}));
			// Create order
			const order = new Order({
				items: orderItems,
				totalAmount: grand_total,
				given_point: 0,
				delivery_charge: delivery_charge,
				paymentMethod: "Online Payment",
				deliveryMethod: "Home Delivery",
				customerInfo: {
					fullName: req.body.order_fullName,
					mobile: req.body.order_mobile,
					email: req.body.order_email,
					address: req.body.order_address,
				},
			});

			await order.save();
			const newOrder = await Order.findById(order._id).populate(
				"items.product"
			);

			// new order mail to admin
			const mailOptions = {
				from: process.env.EMAIL_USER,
				to: "nadmanalvee0585@gmail.com", // admin email
				subject: "New Order Placed - TisdifeCard",
				html: `
					<h2>🛒 New Order Received</h2>
					<p><strong>Order ID:</strong> ${newOrder._id}</p>
					<h3>👤 Customer Information</h3>
					<ul>
						<li><strong>Name:</strong> ${req.body.order_fullName}</li>
						<li><strong>Mobile:</strong> ${req.body.order_mobile}</li>
						<li><strong>Email:</strong> ${req.body.order_email}</li>
						<li><strong>Address:</strong> ${req.body.order_address}</li>
					</ul>
					
					<h3>📦 Order Details</h3>
					<ul>
						${newOrder.items
							.map(
								(item) => `
								<li>
								${item.product.name} - ${item.quantity} x ${item.product.price} BDT
								</li>
							`
							)
							.join("")}
					</ul>
					<p><strong>Total Amount:</strong> <strong>${grand_total} BDT</strong></p>
					<p><strong>Delivery Method:</strong> Home Delivery</p>
					<p><strong>Payment Method:</strong> Online Payment</p>
					<p><strong>Delivery Charge:</strong> ${delivery_charge} BDT</p>
					<hr />
				`,
			};
			await transporter.sendMail(mailOptions);

			res.clearCookie(process.env.CART_NAME); // clear cart cookie

			res.render("order_confirmed", {
				page_title: "Order Confirmed",
				newOrder,
				cartItems: [],
			});
		} catch (error) {
			res.status(500).send("Order processing failed");
		}
	} else {
		try {
			const userId = res.locals.loggedInUser._id;
			const response = await checkoutDetails(req, res, userId);
			if (response === null) {
				res.redirect("/cart");
				return;
			}
			const { user, cartItems, grand_total, point_possible, delivery_charge } =
				response;
			const use_Points = req.body.use_Points === "yes";
			const pointsToDeduct = use_Points
				? Math.min(user.points, grand_total)
				: 0;
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

			await order.save();
			const newOrder = await Order.findById(order._id).populate(
				"items.product"
			);

			// new order mail to admin
			const mailOptions = {
				from: process.env.EMAIL_USER,
				to: "nadmanalvee0585@gmail.com", // admin email
				subject: "New Order Placed - TisdifeCard",
				html: `
					<h2>🛒 New Order Received</h2>
					<p><strong>Order ID:</strong> ${newOrder._id}</p>
					<h3>👤 Customer Information</h3>
					<ul>
						<li><strong>Name:</strong> ${req.body.order_fullName}</li>
						<li><strong>Mobile:</strong> ${req.body.order_mobile}</li>
						<li><strong>Email:</strong> ${req.body.order_email}</li>
						<li><strong>Address:</strong> ${req.body.order_address}</li>
					</ul>
					
					<h3>📦 Order Details</h3>
					<ul>
						${newOrder.items
							.map(
								(item) => `
								<li>
								${item.product.name} - ${item.quantity} x ${item.product.price} BDT
								</li>
							`
							)
							.join("")}
					</ul>
					<p><strong>Total Amount:</strong> <strong>${grand_total} BDT</strong></p>
					<p><strong>Delivery Method:</strong> Home Delivery</p>
					<p><strong>Payment Method:</strong> Online Payment</p>
					<p><strong>Delivery Charge:</strong> ${delivery_charge} BDT</p>
					<hr />
				`,
			};
			await transporter.sendMail(mailOptions);

			await Cart.deleteMany({ userId: user._id });
			// Update user points and order history
			await User.findByIdAndUpdate(user._id, {
				$inc: { points: -pointsToDeduct },
				$push: { orders: order._id },
			});

			res.render("order_confirmed", {
				page_title: "Order Confirmed",
				newOrder,
				cartItems: [],
			});
		} catch (error) {
			res.status(500).send("Order processing failed");
		}
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

module.exports = router;
