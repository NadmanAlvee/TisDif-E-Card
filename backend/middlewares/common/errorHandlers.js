const createHttpError = require("http-errors");

const app = {};

app.notFoundHandler = (req, res, next) => {
	res.redirect("/");
};

app.errorHandler = (err, req, res, next) => {
	res.locals.error =
		process.env.NODE_ENV === "development" ? err : { message: err.message };
	res.redirect("/");
};

module.exports = app;
