const Cart = require("../../models/Cart");
const User = require("../../models/User");

const checkoutDetails = async (userId) => {
	const user = await User.findById(userId);
	const cartItems = await Cart.find({ userId: user._id }).populate("productId");
	if (cartItems.length === 0) return null;
	let grand_total = 0,
		point_possible = 0,
		delivery_charge = 0;
	cartItems.forEach((item) => {
		grand_total += item.total_price;
		point_possible += item.total_price * item.productId.pointsPossible;
	});
	grand_total = parseFloat(grand_total).toFixed(2);
	point_possible = parseFloat(point_possible).toFixed(2);
	delivery_charge = parseFloat(delivery_charge).toFixed(2);

	let total_after_discount = grand_total - (user.points > 0 ? user.points : 0);
	if (total_after_discount < 0) total_after_discount = 0;

	total_after_discount = parseFloat(total_after_discount).toFixed(2);

	return {
		user,
		cartItems,
		grand_total,
		point_possible,
		delivery_charge,
		total_after_discount,
	};
};

module.exports = checkoutDetails;
