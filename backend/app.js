// external imports
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
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

const app = express();
const PORT = process.env.PORT || 80;

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

app.use("/login", sessionInfo, loginRouter);

app.use("/logout", logout);

app.use("/admin", sessionInfo, checkLogin, checkAdmin, adminRouter);

app.use("/product", sessionInfo, checkLogin, productPageRouter);

app.use("/account", sessionInfo, checkLogin, accountRouter);

app.use("/checkout", sessionInfo, checkLogin, checkoutRouter);

app.use("/cart", sessionInfo, checkLogin, cartRouter);

// Error handling
app.use(notFoundHandler); // 404
app.use(errorHandler); // common

// Start the Server
app.listen(PORT, () => {
	console.log(`Server running on http://tisdifecard.com`);
});
