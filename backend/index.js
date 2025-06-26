// Import required packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize dotenv to use environment variables
dotenv.config();

connectDB();

// Initialize the express app
const app = express();

// Set up middleware
// CORS - allows requests from different origins (our frontend)
app.use(cors());
// express.json - allows the server to accept and parse JSON in request bodies
app.use(express.json());

// Define a basic test route
app.get('/api', (req, res) => {
  res.send('Cork Grill API is running...');
});

// Define the port from the .env file, with a fallback
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running in on port ${PORT}`);
});