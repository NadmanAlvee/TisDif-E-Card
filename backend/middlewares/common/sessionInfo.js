function sessionInfo(req, res, next) {
	res.locals.html = true;
	res.locals.loggedInUser = {};
	res.locals.errors = {};
	res.locals.data = {};
	next();
}

module.exports = sessionInfo;
