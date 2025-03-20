const User = require("../../models/User");
const jwt = require("jsonwebtoken");

const checkLogin = async (req, res, next) => {
	let cookies =
		req.signedCookies && Object.keys(req.signedCookies).length > 0
			? req.signedCookies
			: null;

	if (cookies) {
		try {
			const token = cookies[process.env.COOKIE_NAME];

			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const user = await User.findOne({ email: decoded.email });

			if (!user) {
				return res.redirect("/");
			}

			res.locals.loggedInUser = { ...decoded, _id: user._id };

			next();
		} catch (err) {
			return res.redirect("/");
		}
	} else {
		next();
	}
};

module.exports = { checkLogin };
