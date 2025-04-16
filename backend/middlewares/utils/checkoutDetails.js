const Cart = require("../../models/Cart");
const User = require("../../models/User");
const Product = require("../../models/Product");

const checkoutDetails = async (req, res, userId) => {
	if (!res.locals.loggedInUser || !res.locals.loggedInUser._id) {
		const cartCookie = req.signedCookies[process.env.CART_NAME];
		const cartItems = cartCookie ? JSON.parse(cartCookie) : [];
		if (!(cartItems.length > 0)) return null;
		const populatedItems = await Promise.all(
			cartItems.map(async (item) => {
				const product = await Product.findById(item.productId);
				if (!product) return null;
				return {
					productId: product,
					_id: item._id,
					total_price: item.total_price,
					selected_quantity: item.selected_quantity,
				};
			})
		);
		if (populatedItems.length === 0) return null;
		let grand_total = 0;
		populatedItems.forEach((item) => {
			grand_total += item.total_price;
		});
		grand_total = parseFloat(grand_total).toFixed(2);
		const validItems = populatedItems.filter((item) => item !== null);
		return {
			cartItems: validItems,
			grand_total,
			user: {
				points: 0,
			},
			point_possible: 0,
			total_after_discount: grand_total,
			delivery_charge: 0,
		};
	} else {
		const user = await User.findById(userId);
		const cartItems = await Cart.find({ userId: user._id }).populate(
			"productId"
		);
		if (cartItems.length === 0) return null;
		let grand_total = 0,
			point_possible = 0;
		cartItems.forEach((item) => {
			grand_total += item.total_price;
			point_possible += item.total_price * item.productId.pointsPossible;
		});
		grand_total = parseFloat(grand_total).toFixed(2);
		point_possible = parseFloat(point_possible).toFixed(2);
		let total_after_discount =
			grand_total - (user.points > 0 ? user.points : 0);
		if (total_after_discount < 0) total_after_discount = 0;
		total_after_discount = parseFloat(total_after_discount).toFixed(2);
		return {
			user,
			cartItems,
			grand_total,
			point_possible,
			total_after_discount,
			delivery_charge: 0,
		};
	}
};
module.exports = checkoutDetails;

module.exports = checkoutDetails;
