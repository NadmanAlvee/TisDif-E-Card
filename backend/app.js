// external imports
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();

// internel imports
const authGuard = require("./middlewares/auth");
const {
	checkLogin,
	redirectLoggedIn,
} = require("./middlewares/common/checkLogin");
const sessionInfo = require("./middlewares/common/sessionInfo");
const connectDB = require("./MongooseConfig");
const {
	errorHandler,
	notFoundHandler,
} = require("./middlewares/common/errorHandlers");
const homepageRouter = require("./routes/homepageRouter");
const loginRouter = require("./routes/loginRouter");
const productPageRouter = require("./routes/productPageRouter");
const adminRouter = require("./routes/adminRouter");
const logout = require("./controller/logoutController");

const app = express();
const PORT = process.env.PROD_PORT || 80;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Frontend Routes
app.use("/", sessionInfo, checkLogin, homepageRouter);

app.use("/login", sessionInfo, redirectLoggedIn, loginRouter);

app.use("/logout", logout);

app.use("/admin", sessionInfo, checkLogin, authGuard, adminRouter);

app.use("/product", sessionInfo, checkLogin, productPageRouter);

// Error handling
app.use(notFoundHandler); // 404
app.use(errorHandler); // common

// Start the Server
app.listen(PORT, () => {
	console.log(`Server running on http://tisdifecard.com:${PORT}`);
});
