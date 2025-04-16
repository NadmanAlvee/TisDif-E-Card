// external imports
const express = require("express");
const compression = require("compression");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const app = express();
app.use(
	compression({
		threshold: 0, // in bytes, 1024 byte - 1kb
		level: 6,
	})
);
// internel imports
const checkAdmin = require("./middlewares/checkAdmin");
const findSlides = require("./middlewares/utils/findSlides");
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
const trackOrderRouter = require("./routes/trackOrderRouter");
const checkoutRouter = require("./routes/checkoutRouter");
const cartRouter = require("./routes/cartRouter");
const orderRouter = require("./routes/orderRouter");
const searchRouter = require("./routes/searchRouter");

const PORT = process.env.PORT;
// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Frontend Routes
app.use("/", sessionInfo, checkLogin, findSlides, homepageRouter);
app.use("/login", sessionInfo, loginRouter);
app.use("/logout", logout);
app.use("/admin", sessionInfo, checkLogin, findSlides, checkAdmin, adminRouter);
app.use("/product", sessionInfo, productPageRouter);
app.use("/search", sessionInfo, searchRouter);
app.use("/account", sessionInfo, checkLogin, accountRouter);
app.use("/trackOrder", sessionInfo, checkLogin, trackOrderRouter);
app.use("/checkout", sessionInfo, checkLogin, checkoutRouter);
app.use("/cart", sessionInfo, checkLogin, cartRouter);
app.use("/order", sessionInfo, checkLogin, orderRouter);

// Error handling
app.use(notFoundHandler); // 404 page

app.use(errorHandler); // common

// Start the Server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
