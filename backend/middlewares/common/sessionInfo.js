function sessionInfo(req, res, next) {
	if (!res.locals.loggedInUser) {
		res.locals.loggedInUser = {};
	}
	res.locals.errors = {};
	next();
}

module.exports = sessionInfo;
