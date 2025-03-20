const { check, validationResult } = require("express-validator");

const doLoginValidators = [
	check("userid")
		.isLength({
			min: 1,
		})
		.withMessage("Mobile number or email is required"),
	check("password").isLength({ min: 1 }).withMessage("Password is required"),
];

const doLoginValidationHandler = function (req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		req.flash("loginErrors", errors.mapped());
		req.flash("loginData", req.body); // Preserve form data
	}
	next();
};

module.exports = {
	doLoginValidators,
	doLoginValidationHandler,
};
