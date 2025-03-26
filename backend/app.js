// external imports
const express = require("express");
const compression = require("compression");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");
dotenv.config();

// internel imports
const checkAdmin = require("./middlewares/checkAdmin");
const { checkLogin } = require("./middlewares/common/checkLogin");
const sessionInfo = require("./middlewares/common/sessionInfo");
const connectDB = require("./MongooseConfig");
const {
	errorHandler,
	notFoundHandler,
} = require("./middlewares/common/errorHandlers");
const logout = require("./controller/logoutController");
// routes
const homepageRouter = require("./routes/homepageRouter");
const loginRouter = require("./routes/loginRouter");
const productPageRouter = require("./routes/productPageRouter");
const adminRouter = require("./routes/adminRouter");
const accountRouter = require("./routes/accountRouter");
const checkoutRouter = require("./routes/checkoutRouter");
const cartRouter = require("./routes/cartRouter");
const orderRouter = require("./routes/orderRouter");
const searchRouter = require("./routes/searchRouter");

const app = express();
app.use(
	compression({
		level: 6, // Compression level (0-9)
		threshold: 1024, // Compress responses larger than 1KB
	})
);
const PORT = process.env.PORT;
// Connect to MongoDB
connectDB();
// Session
app.use(
	session({
		name: "tisdifecard",
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
		},
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Frontend Routes
app.use("/", sessionInfo, checkLogin, homepageRouter);

app.use("/login", sessionInfo, loginRouter);

app.use("/logout", logout);

app.use("/admin", sessionInfo, checkLogin, checkAdmin, adminRouter);

app.use("/product", sessionInfo, checkLogin, productPageRouter);

app.use("/account", sessionInfo, checkLogin, accountRouter);

app.use("/checkout", sessionInfo, checkLogin, checkoutRouter);

app.use("/cart", sessionInfo, checkLogin, cartRouter);

app.use("/order", sessionInfo, checkLogin, orderRouter);

app.use("/search", sessionInfo, checkLogin, searchRouter);

// Error handling
app.use(notFoundHandler); // 404
app.use(errorHandler); // common

// Start the Server
app.listen(PORT, () => {
	console.log(`Server running on http://tisdifecard.com`);
});
