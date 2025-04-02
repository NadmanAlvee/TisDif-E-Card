const { check, validationResult } = require("express-validator");
const Cart = require("../../models/Cart");

const doLoginValidators = [
	check("userid")
		.isLength({
			min: 1,
		})
		.withMessage("Mobile number or email is required"),
	check("password").isLength({ min: 1 }).withMessage("Password is required"),
];

const doLoginValidationHandler = async function (req, res, next) {
	const errors = validationResult(req);
	const mappedErrors = errors.mapped();
	if (Object.keys(mappedErrors).length === 0) {
		next();
	} else {
		const userId = res.locals.loggedInUser._id;
		const cartItems = await Cart.find({ userId });
		const page_title = "TisDif e-Card | Login";
		res.render("login_page.ejs", {
			errors: mappedErrors,
			loggedInUser: res.locals.loggedInUser,
			cartItems: cartItems,
			page_title,
		});
	}
};

module.exports = {
	doLoginValidators,
	doLoginValidationHandler,
};
