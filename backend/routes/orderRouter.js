const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const nodemailer = require("nodemailer");

router.post("/checkout", async (req, res) => {
	try {
		const user = res.locals.loggedInUser;
		if (!user) return res.redirect("/login");

		const cartItems = await Cart.find({ userId: user._id }).populate(
			"productId"
		);

		if (cartItems.length === 0) return res.redirect("/cart");

		let totalPrice = 0;
		const orderProducts = cartItems.map((item) => {
			totalPrice += item.productId.price * item.selected_quantity;
			return {
				productId: item.productId._id,
				quantity: item.selected_quantity,
				price: item.productId.price,
			};
		});

		// Create the order
		const newOrder = new Order({
			userId: user._id,
			products: orderProducts,
			totalPrice,
			transactionCode: "PAYMENT_PENDING", // Replace with actual transaction details
			status: "pending",
		});
		await newOrder.save();

		// Clear cart
		await Cart.deleteMany({ userId: user._id });

		// Send confirmation email
		await sendOrderEmail(user, newOrder, cartItems);

		// Send WhatsApp notification (optional)
		await sendWhatsAppMessage(user, newOrder);

		res.redirect("/account");
	} catch (error) {
		console.error("Checkout error:", error);
		res.status(500).send("Server Error");
	}
});

// Send Email Function
async function sendOrderEmail(user, order, cartItems) {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL, // Your email
			pass: process.env.EMAIL_PASSWORD, // Your email password
		},
	});

	const itemsList = cartItems
		.map(
			(item) =>
				`<li>${item.productId.name} - ${item.selected_quantity} pcs</li>`
		)
		.join("");

	const mailOptions = {
		from: process.env.EMAIL,
		to: user.email,
		subject: "Order Confirmation",
		html: `<h3>Thank you for your order, ${user.username}!</h3>
               <p>Order ID: ${order._id}</p>
               <p>Total: ${order.totalPrice} BDT</p>
               <ul>${itemsList}</ul>
               <p>We will notify you once your order is confirmed.</p>`,
	};

	await transporter.sendMail(mailOptions);
}

module.exports = router;
