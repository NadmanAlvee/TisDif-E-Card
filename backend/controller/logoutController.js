const logout = (req, res, next) => {
	res.clearCookie(process.env.COOKIE_NAME);
	res.redirect("/");
};

module.exports = logout;
