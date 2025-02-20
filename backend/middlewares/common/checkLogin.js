const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
	let cookies =
		req.signedCookies && Object.keys(req.signedCookies).length > 0
			? req.signedCookies
			: null;

	if (cookies) {
		try {
			const token = cookies[process.env.COOKIE_NAME];

			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decoded;

			res.locals.loggedInUser = decoded;

			next();
		} catch (err) {
			return res.redirect("/");
		}
	} else {
		next();
	}
};

const redirectLoggedIn = function (req, res, next) {
	let cookies =
		req.signedCookies && Object.keys(req.signedCookies).length > 0
			? req.signedCookies
			: null;

	if (!cookies) {
		next();
	} else {
		res.redirect("/");
	}
};

module.exports = { checkLogin, redirectLoggedIn };
