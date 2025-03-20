const logout = (req, res, next) => {
	req.session.destroy((err) => {
		if (err) {
			console.error("Error destroying session:", err);
			return next(err);
		}
		res.clearCookie(process.env.COOKIE_NAME);
		res.redirect("/");
	});
};

module.exports = logout;
