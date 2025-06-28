const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Path: ./config/db.js
const MenuItem = require('./models/menuItemModel'); // Path: ./models/menuItemModel.js
const menuItems = require('./data/menuItems'); // Path: ./data/menuItems.js

// --- THIS IS THE DEBUGGING LINE TO ADD ---
console.log('Data being loaded:', menuItems); 
// ------------------------------------------


dotenv.config();

const importData = async () => {
  try {
    // 1. Connect to DB
    await connectDB();

    // 2. Clear existing items
    await MenuItem.deleteMany();

    // 3. Insert new items
    await MenuItem.insertMany(menuItems);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    // 1. Connect to DB
    await connectDB();

    // 2. Clear existing items
    await MenuItem.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// This logic was changed slightly to call connectDB within the functions
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}