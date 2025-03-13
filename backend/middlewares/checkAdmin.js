const checkAdmin = (req, res, next) => {
	const { role } = res.locals.loggedInUser;
	if (role == "admin") {
		next();
	} else {
		res.redirect("/");
	}
};

module.exports = checkAdmin;
