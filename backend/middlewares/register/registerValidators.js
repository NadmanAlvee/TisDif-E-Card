const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const User = require("../../models/User");

const doRegisterValidators = [
	check("username")
		.isLength({ min: 1 })
		.withMessage("Name is required")
		.matches(/^[A-Za-z\s'-]+$/)
		.withMessage(
			"Name must only contain alphabets, spaces, hyphens, or apostrophes"
		)
		.trim(),
	check("email")
		.isEmail()
		.withMessage("Invalid email address")
		.trim()
		.custom(async (value) => {
			const user = await User.findOne({ email: value });
			if (user) {
				throw createError("Email already in use!");
			}
		}),
	check("mobile")
		.isMobilePhone()
		.withMessage("Must be a valid Mobile Number")
		.trim()
		.custom(async (value) => {
			const user = await User.findOne({ mobile: value });
			if (user) {
				throw createError("Mobile already in use!");
			}
		}),
	check("new_password")
		.isStrongPassword()
		.withMessage(
			"Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
		),
	check("confirm_password").custom((value, { req }) => {
		if (value !== req.body.new_password) {
			throw new Error("Passwords must be the same");
		}
		return true;
	}),
];

const doRegisterValidationHandler = (req, res, next) => {
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
	doRegisterValidators,
	doRegisterValidationHandler,
};
