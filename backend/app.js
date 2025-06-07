// external imports
const express = require("express");
const compression = require("compression");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const app = express();
const allowedOrigins = [
  "https://tisdifecard.com",
  "http://tisdifecard.com",
  "https://www.tisdifecard.com",
  "http://www.tisdifecard.com",
  "http://localhost:8080",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS: Origin ${origin} not allowed`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
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
const Product = require("./models/Product");
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
app.get("/sitemap.xml", async (req, res) => {
  try {
    const products = await Product.find({}, "slug"); // get IDs to build URLs
    const urls = products
      .map(
        (p) => `
		<url>
		  <loc>https://tisdifecard.com/product/${p.slug}</loc>
		  <changefreq>weekly</changefreq>
		  <priority>0.8</priority>
		</url>`
      )
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
	  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
		${urls}
	  </urlset>`;
    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    console.error("Sitemap error:", err);
    res.status(500).send("Internal Server Error");
  }
});

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
