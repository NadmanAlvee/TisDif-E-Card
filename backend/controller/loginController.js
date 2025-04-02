// external imports
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internalimports
const User = require("../models/User");
const Cart = require("../models/Cart");

// get login page
async function getLogin(req, res, next) {
	const page_title = "TisDif e-Card | Login";
	res.render("login_page.ejs", {
		loggedInUser: {},
		cartItems: [],
		page_title,
	});
}

async function login(req, res, next) {
	try {
		// Find a user by email or mobile
		const user = await User.findOne({
			$or: [{ email: req.body.userid }, { mobile: req.body.userid }],
		});

		if (user && user._id) {
			// Validate password
			const isValidPassword = await bcrypt.compare(
				req.body.password,
				user.password
			);

			if (isValidPassword) {
				// Prepare user object and generate token
				const userObject = {
					username: user.username,
					mobile: user.mobile,
					email: user.email,
					role: user.role === "admin" ? "admin" : "customer", // Set role conditionally
				};

				const token = jwt.sign(userObject, process.env.JWT_SECRET, {
					expiresIn: process.env.JWT_EXPIRY || "1d", // Default to 1 day if JWT_EXPIRY is not set
				});

				// Set cookie with the token
				res.cookie(process.env.COOKIE_NAME, token, {
					maxAge: 86400000,
					httpOnly: true,
					secure: process.env.NODE_ENV === "production", // enable in production
					signed: true,
				});

				res.locals.loggedInUser = user;

				// Redirect to account page after successful login
				return res.redirect("/account");
			} else {
				throw createError("Login failed! Incorrect password.");
			}
		} else {
			throw createError("Login failed! User not found.");
		}
	} catch (err) {
		const cartItems = [];
		const page_title = "TisDif e-Card | Login";
		res.render("login_page.ejs", {
			errors: {
				common: { msg: err.message },
			},
			loggedInUser: {},
			cartItems,
			page_title,
		});
	}
}

module.exports = {
	getLogin,
	login,
};
