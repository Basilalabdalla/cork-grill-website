const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// --- Import all the models we need ---
const MenuItem = require('./models/menuItemModel');
const AdminUser = require('./models/adminUserModel');
const Category = require('./models/categoryModel');

// --- Define all our data in one place ---
const menuItems = [
  { name: 'The Classic Burger', category: 'Burgers', description: '6oz Irish beef patty, cheese, lettuce, onion, tomato, and house sauce.', price: 10.95, imageUrl: 'https://res.cloudinary.com/descwls78/image/upload/v1751167958/cork-grill/bqwnpboronorgi1tzemj.jpg' },
  { name: 'Spicy Chicken Burger', category: 'Burgers', description: 'Crispy fried chicken, spicy slaw, pickles, and chili mayo.', price: 11.50, imageUrl: 'https://res.cloudinary.com/descwls78/image/upload/v1751168025/cork-grill/gph1fcpn5z9ggd8mi2eo.jpg' },
  { name: 'Chicken Shawarma Wrap', category: 'Wraps', description: 'Marinated chicken, garlic sauce, pickles, and fries wrapped in flatbread.', price: 9.95, imageUrl: 'https://res.cloudinary.com/descwls78/image/upload/v1751168063/cork-grill/meye2hdt6gbeq6sqngiq.jpg' },
  { name: 'The Meal Deal', category: 'Deals', description: 'Choose any burger, a side of fries, and a soft drink.', price: 15.00, imageUrl: 'https://res.cloudinary.com/descwls78/image/upload/v1751168091/cork-grill/ypok3exn49nj0liy6m4w.jpg' },
  { name: 'Falafel Wrap', category: 'Wraps', description: 'Homemade falafel, hummus, lettuce, tomato, and tahini sauce.', price: 9.50, imageUrl: 'https://res.cloudinary.com/descwls78/image/upload/v1751168091/cork-grill/ypok3exn49nj0liy6m4w.jpg' }
];

const categories = [
    { name: 'Deals' },
    { name: 'Burgers' },
    { name: 'Wraps' },
    { name: 'Sides' },
    { name: 'Drinks' },
];

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    // Clear all collections
    await MenuItem.deleteMany();
    await AdminUser.deleteMany();
    await Category.deleteMany();

    // Insert new data
    await Category.insertMany(categories);
    await MenuItem.insertMany(menuItems);

    // Create admin user
    const adminUser = new AdminUser({ username: 'admin', password: 'password123' });
    await adminUser.save();

    console.log('Data Imported! (Menu, Admin, Categories)');
    process.exit();
  } catch (error) {
    console.error(`Error during data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await MenuItem.deleteMany();
    await AdminUser.deleteMany();
    await Category.deleteMany(); // <-- This was also missing

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error during data destruction: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}