const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// --- Import all routes first ---
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// --- Connect to DB and initialize app ---
connectDB();
const app = express();

// --- Set up ALL middleware BEFORE routes ---
app.use(cors());
app.use(express.json()); // This MUST come before the routes are defined

const corsOptions = {
  // We will add your live frontend URL here once it's deployed.
  // For now, we just allow our development frontend.
  origin: ['https://cork-grill-website.vercel.app','http://localhost:5173'], 
};

app.use(cors(corsOptions));
// --- Define a basic test route (optional) ---
app.get('/api', (req, res) => {
  res.send('Cork Grill API is running...');
});

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