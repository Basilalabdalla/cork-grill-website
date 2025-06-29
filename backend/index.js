const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// --- Import all routes ---
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// --- Connect to DB and initialize app ---
connectDB();
const app = express();

// --- Set up ALL middleware BEFORE routes ---
app.use(express.json());

// --- NEW, MORE ROBUST CORS CONFIGURATION ---
const whitelist = [
    'http://localhost:5173', // For local development
    'https://cork-grill-website.vercel.app' // Your main production domain
];

const corsOptions = {
    origin: function (origin, callback) {
        // The 'origin' is the URL of the site making the request (e.g., your Vercel URL)
        // We check if the incoming origin is in our whitelist OR if it's a Vercel preview URL
        if (whitelist.indexOf(origin) !== -1 || (origin && origin.endsWith('.vercel.app')) || !origin) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS')); // Block the request
        }
    }
};

app.use(cors(corsOptions));
// --- END OF NEW CORS CONFIGURATION ---


// --- Define all API routes LAST ---
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/upload', uploadRoutes);


const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});