// sessionInfo.js
function sessionInfo(req, res, next) {
	// Some static locals
	res.locals.html = true;
	res.locals.loggedInUser = {};

	res.locals.loginErrors = req.flash("loginErrors")[0] || {};
	res.locals.loginData = req.flash("loginData")[0] || {};
	res.locals.registerErrors = req.flash("registerErrors")[0] || {};
	res.locals.registerData = req.flash("registerData")[0] || {};

	next();
}

module.exports = sessionInfo;
