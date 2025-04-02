const logout = (req, res, next) => {
	res.clearCookie(process.env.COOKIE_NAME); // JWT cookie
	res.redirect("/");
};

module.exports = logout;
