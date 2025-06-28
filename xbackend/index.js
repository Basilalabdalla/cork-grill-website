// 1. First, require the package.
const dotenv = require('dotenv');
// 2. THEN, call the config method.
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.send('Cork Grill API is running...');
});

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server is running in on port ${PORT}`);
});