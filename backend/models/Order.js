const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	items: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
			quantity: Number,
			price: Number,
		},
	],
	totalAmount: Number,
	point_possible: Number,
	given_point: Number,
	delivery_charge: Number,
	pointsUsed: Number,
	paymentMethod: String,
	deliveryMethod: String,
	customerInfo: {
		fullName: String,
		mobile: String,
		email: String,
		address: String,
	},
	status: {
		type: String,
		default: "Pending",
		enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
	},
	orderDate: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Order", orderSchema);
