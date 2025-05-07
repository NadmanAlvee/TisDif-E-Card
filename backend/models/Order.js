const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
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
	payment_method: String,
	billing_method: String,
	transaction_id: String,
	four_digit: Number,
	payment_amount: Number,
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
	},
	message: {
		type: String,
		default: "",
	},
	orderDate: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Order", orderSchema);
