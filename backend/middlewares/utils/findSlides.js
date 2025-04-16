const { resolve } = require("path");
const fs = require("fs");

const getSlides = (req, res, next) => {
	const slidesDir = resolve(__dirname, "../../../public/images/slides");
	let slides;
	fs.readdir(slidesDir, (err, files) => {
		if (err) {
			console.log("Error reading slides directory:", err);
			return next(); // Proceed without images
		}
		slides = files.map((file) => "/images/slides/" + file);
		res.locals.slides = slides;
		next();
	});
};

module.exports = getSlides;
