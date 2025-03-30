const createHttpError = require("http-errors");
const Cart = require("../../models/Cart");
const app = {};

app.notFoundHandler = async (req, res, next) => {
	try {
		const userId = res.locals.loggedInUser ? res.locals.loggedInUser._id : null;
		const cartItems = userId ? await Cart.find({ userId }) : [];
		const page_title = "404 | not found";
		res.render("notFound", {
			cartItems: cartItems,
			page_title,
		});
	} catch (error) {
		res.status(500).send("Error fetching products.");
	}
};

app.errorHandler = (err, req, res, next) => {
	res.locals.error = { message: err.message };
	res.redirect("/");
};

module.exports = app;
