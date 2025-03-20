const logout = (req, res, next) => {
	req.session.destroy((err) => {
		if (err) {
			console.error("Error destroying session:", err);
			return next(err);
		}
		res.clearCookie("tisdifecard"); // This is the session cookie
		res.clearCookie(process.env.COOKIE_NAME); // JWT cookie

		res.redirect("/");
	});
};

module.exports = logout;
