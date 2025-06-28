const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// --- Import all the data and models we need ---
const menuItems = require('./data/menuItems');
const MenuItem = require('./models/menuItemModel');
const AdminUser = require('./models/adminUserModel');

dotenv.config();

const importData = async () => {
  try {
    // 1. Connect to the database
    await connectDB();

    // 2. Clear out any old data to prevent duplicates
    await MenuItem.deleteMany();
    await AdminUser.deleteMany();

    // 3. Insert the menu items from our data file
    await MenuItem.insertMany(menuItems);

    // 4. Create the new default administrator user
    const adminUser = new AdminUser({
      username: 'admin',
      password: 'password123', // For a real application, use a stronger password and manage it securely
    });

    // The 'pre-save' hook in our model will automatically hash the password
    await adminUser.save();

    console.log('Data Imported! (Menu Items & Admin User)');
    process.exit();
  } catch (error) {
    console.error(`Error during data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    // Clear all data
    await MenuItem.deleteMany();
    await AdminUser.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error during data destruction: ${error.message}`);
    process.exit(1);
  }
};

// This allows us to run 'npm run data:import' or 'npm run data:destroy'
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}