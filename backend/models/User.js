const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		address: [String],
		mobile: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		points: {
			type: Number,
			default: 0,
		},
		role: {
			type: String,
			default: "customer",
		},
		orders: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Order",
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", UserSchema);
