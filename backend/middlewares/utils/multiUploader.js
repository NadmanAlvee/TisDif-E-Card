const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const ensureDirExists = (dir) => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
};
// Multer storage configuration
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const category = req.body.productCategory;
		const uploadDir = path.resolve(
			__dirname,
			"../../../public/images/products",
			category
		);
		ensureDirExists(uploadDir);
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		const fileExt = path.extname(file.originalname);
		const productName = req.body.productName.replace(/ /g, "_");
		const fileName = `${productName}_${randomUUID()}${fileExt}`;
		cb(null, fileName);
	},
});

// File filter
const fileFilter = (req, file, cb) => {
	const allowedTypes = [
		"image/jpeg",
		"image/png",
		"image/webp",
		"image/heic",
		"image/heif",
	];
	allowedTypes.includes(file.mimetype)
		? cb(null, true)
		: cb(new Error("Invalid file type"), false);
};

// Multer instance
const multiUploader = multer({
	storage,
	fileFilter,
	limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports = multiUploader;
