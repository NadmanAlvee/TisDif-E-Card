// sessionInfo.js
function sessionInfo(req, res, next) {
	// Some static locals
	res.locals.loggedInUser = {};
	res.locals.errors = {};
	next();
}

module.exports = sessionInfo;
