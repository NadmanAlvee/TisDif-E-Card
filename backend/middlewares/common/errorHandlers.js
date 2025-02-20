const createHttpError = require("http-errors");

const app = {};

app.notFoundHandler = (req, res, next) => {
	next(createHttpError(404, "Could not found requested data!"));
};

app.errorHandler = (err, req, res, next) => {
	res.locals.error =
		process.env.NODE_ENV === "development" ? err : { message: err.message };
	if (res.locals.html) {
		// html response
		res.render("error", {
			title: "Error Page",
		});
	} else {
		// json response for api
		res.json(res.locals.error);
	}
};

module.exports = app;
