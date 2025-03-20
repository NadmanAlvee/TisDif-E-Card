// external imports
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internalimports
const User = require("../models/User");

// get login page
async function getLogin(req, res, next) {
	res.render("login_page.ejs", {
		loggedInUser: res.locals.loggedInUser,
	});
}

// do login
async function login(req, res, next) {
	// login process
	try {
		// find a user with this email or username
		const user = await User.findOne({
			$or: [{ email: req.body.userid }, { mobile: req.body.userid }],
		});
		if (user && user._id) {
			const isValidPassword = await bcrypt.compare(
				req.body.password,
				user.password
			);
			// prepare token if password is correct
			if (isValidPassword) {
				// token
				const userObject = {
					username: user.username,
					mobile: user.mobile,
					email: user.email,
					role: "customer",
				};
				if (user.role == "admin") {
					userObject.role = "admin";
				}

				// generate token
				const token = jwt.sign(userObject, process.env.JWT_SECRET, {
					expiresIn: process.env.JWT_EXPIRY,
				});

				// set cookie
				res.cookie(process.env.COOKIE_NAME, token, {
					maxAge: 86400000,
					httpOnly: true,
					signed: true,
				});
				// logged in user local identifier
				res.locals.loggedInUser = userObject;
				// render homepage
				res.redirect("/");
			} else {
				throw createError("Login failed! Please try again.");
			}
		} else {
			throw createError("Login failed! Please try again.");
		}
	} catch (err) {
		res.render("login_page.ejs", {
			errors: {
				common: {
					msg: err.message,
				},
			},
		});
	}
}

// DO LOGOUT
function logout(req, res) {
	res.clearCookie(process.env.COOKIE_NAME);
	res.send("logged out");
}

module.exports = {
	getLogin,
	login,
	logout,
};
