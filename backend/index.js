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
const categoryRoutes = require('./routes/categoryRoutes'); // <-- This was the missing import

connectDB();
const app = express();

// --- CORS Configuration ---
const whitelist = [
    'http://localhost:5173',
    'https://cork-grill-website.vercel.app',
    'https://corkgrill.com',
    'http://corkgrill.com',
    'https://corkgrill.ie',
    'http://corkgrill.ie'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};
app.use(cors(corsOptions));
app.use(express.json());

// --- API Routes ---
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/homepage', homePageRoutes);
app.use('/api/categories', categoryRoutes); // <-- THIS WAS THE MISSING LINE

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});