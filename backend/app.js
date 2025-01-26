const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./MongooseConfig');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const session = require('express-session');
dotenv.config();

const app = express();
const PORT = process.env.DEV_PORT;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Session Middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'supersecretkey',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 3600000 }, // 1 hour
    })
);

// Serve Static Files
app.use(express.static(path.join(__dirname, '../public')));

// Frontend Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/login_page', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login_page.html'));
});

app.get('/product-details', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/product-details.html'));
});

// API Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/products', productRoutes); // Product management routes

// default error handler
const errorHandler = (err, req, res, next)=> {
  if(req.headersSent){
      return next(err);
  }
  res.status(500).json({ error: err });
};
app.use(errorHandler);

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error(`Server error: ${err.message}`);
});
