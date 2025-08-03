const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const homePageRoutes = require('./routes/homePageRoutes');

connectDB();
const app = express();
app.use(express.json());

// --- THIS IS THE FINAL, CORRECT CORS CONFIGURATION ---
const whitelist = [
    'http://localhost:5173', // Your local dev frontend
    'https://cork-grill-website.vercel.app' // Your main production frontend URL
];

const corsOptions = {
    origin: function (origin, callback) {
        // The 'origin' is the URL of the site making the request (e.g., your Vercel URL)
        // We check if the incoming origin is in our whitelist.
        // We also allow requests that have no origin (like Postman or server-to-server)
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true); // Allow the request
        } else {
            console.error(`CORS Error: Request from origin ${origin} blocked.`);
            callback(new Error('Not allowed by CORS')); // Block the request
        }
    }
};

app.use(cors(corsOptions));
// --- END OF FINAL CORS CONFIGURATION ---

// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/homepage', homePageRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});