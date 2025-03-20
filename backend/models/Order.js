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
		enum: ["Pending", "Processing", "Shipped", "Delivered"],
	},
	orderDate: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Order", orderSchema);
