const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: true,
	},
	total_price: { type: Number, required: true },
	selected_quantity: { type: Number, required: true },
	orderDate: { type: Date, default: Date.now },
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
