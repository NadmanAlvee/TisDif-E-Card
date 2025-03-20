const User = require("../../models/User");
const jwt = require("jsonwebtoken");

const checkLogin = async (req, res, next) => {
	let cookies =
		req.signedCookies && Object.keys(req.signedCookies).length > 0
			? req.signedCookies
			: null;
	if (cookies != null) {
		try {
			const token = cookies[process.env.COOKIE_NAME];

			// Verify JWT
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const user = await User.findOne({ email: decoded.email });

			if (!user) {
				res.clearCookie(process.env.COOKIE_NAME);
				return res.redirect("/login");
			}

			res.locals.loggedInUser = { ...decoded, _id: user._id };

			return next();
		} catch (err) {
			res.clearCookie(process.env.COOKIE_NAME);
			res.render("login_page.ejs", {
				loggedInUser: res.locals.loggedInUser,
			});
		}
	} else {
		res.render("login_page.ejs", {
			loggedInUser: res.locals.loggedInUser,
		});
	}
};

module.exports = { checkLogin };
