const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const checkLogin = async (req, res, next) => {
	let cookies =
		process.env.COOKIE_NAME in req.signedCookies ? req.signedCookies : null;
	if (cookies) {
		try {
			const token = cookies[process.env.COOKIE_NAME];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const user = await User.findOne({
				$or: [{ email: decoded.email }, { mobile: decoded.mobile }],
			});
			res.locals.loggedInUser = user;
			next();
		} catch (err) {
			return res.redirect("/login");
		}
	}
	if (!cookies) {
		next();
	}
};

module.exports = { checkLogin };
