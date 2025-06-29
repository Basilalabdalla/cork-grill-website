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
    origin: [
        'http://localhost:5173', // For local development
        // This Regular Expression will match:
        // 1. https://cork-grill-website.vercel.app
        // 2. https://cork-grill-website-git-main...vercel.app
        // 3. Any other Vercel preview URL for this project.
        /^https:\/\/cork-grill-website.*\.vercel\.app$/ 
    ],
    credentials: true, // This can be helpful for future features
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