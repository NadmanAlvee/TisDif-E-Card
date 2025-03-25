// External imports
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// Internal imports
const User = require("../models/User");

// Register User
async function register(req, res, next) {
	try {
		const { username, email, mobile, new_password, country_code } = req.body;

		// Validate required fields
		if (!username || !email || !mobile || !new_password || !country_code) {
			throw createError(400, "All fields are required");
		}

		// Remove leading zero from mobile if present
		let processedMobile = mobile;
		if (processedMobile.startsWith("0")) {
			processedMobile = processedMobile.substring(1);
		}
		if (processedMobile.startsWith(country_code)) {
			processedMobile = processedMobile.substring(country_code.length);
		}

		// Concatenate country code with mobile number
		processedMobile = country_code + processedMobile;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw createError(409, "User already exists");
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(new_password, salt);

		// Create new user
		const newUser = new User({
			username,
			email,
			mobile: processedMobile,
			password: hashedPassword,
		});

		const result = await newUser.save();

		// Create user object for JWT
		const userObject = {
			username: result.username,
			email: result.email,
			mobile: result.mobile,
		};

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

		// Save user in local session
		res.locals.loggedInUser = userObject;

		console.log("New Register: \n" + res.locals.loggedInUser);

		// Send response
		if (req.headers?.accept?.includes("application/json")) {
			res.status(201).json({
				message: "User registered successfully",
				user: userObject,
			});
		} else {
			res.redirect("/account");
		}
	} catch (err) {
		res.redirect("/login");
	}
}

module.exports = { register };
