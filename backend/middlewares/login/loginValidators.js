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
	const mappedErrors = errors.mapped();
	if (Object.keys(mappedErrors).length === 0) {
		next();
	} else {
		console.log(errors);
		res.render("login_page.ejs", {
			errors: mappedErrors,
		});
	}
};

module.exports = {
	doLoginValidators,
	doLoginValidationHandler,
};
