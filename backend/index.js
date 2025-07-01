const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors'); // We still need to require it, but won't use our options
const connectDB = require('./config/db');

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

connectDB();
const app = express();
app.use(express.json());

// --- TEMPORARY DEBUGGING MIDDLEWARE ---
// This manually sets CORS headers to allow ALL origins.
// This is NOT secure for production, but it is the ultimate test.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});
// --- We are no longer using app.use(cors(corsOptions)) ---


// --- API Routes ---
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);


const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});