const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const MenuItem = require('./models/menuItemModel');
const AdminUser = require('./models/adminUserModel');
const Category = require('./models/categoryModel');
const Promotion = require('./models/promotionModel');

// --- NEW, MORE DETAILED MENU DATA ---
const menuItems = [
  {
    name: 'Cheese Burger',
    category: 'Burgers',
    description: 'Beef, Lettuce, Onions, Ketchup, Burger sauce, Salad, Pickles, Tomato, Cheese.',
    price: 6.95,
    imageUrl: 'https://res.cloudinary.com/descwls78/image/upload/v1751323326/cork-grill/h2bkhryhjgwbxi9gnvbt.jpg', // Replace with a real URL
    customizationGroups: [
      {
        title: 'Make It a Meal',
        type: 'SINGLE',
        maxSelections: 1,
        options: [
          { name: 'Yes (Fries & Drink)', price: 4.50 }
        ]
      }
    ]
  },
  {
    name: 'Family Deal 1',
    category: 'Deals',
    description: '2 Chicken Kebab Wraps, 1 Falafel Wrap, 1 Lamb Kebab Wrap, 2 Portions of Chips, 2 Drinks, 2 Sauces.',
    price: 32.50,
    imageUrl: 'https://res.cloudinary.com/descwls78/image/upload/v1751323326/cork-grill/cduxprgfomhdqgnajs6t.jpg', // Replace with a real URL
    customizationGroups: [
      {
        title: 'Choose your drinks',
        type: 'MULTIPLE',
        maxSelections: 2, // The user must choose exactly 2
        options: [
          { name: 'Coca Cola' }, { name: 'Coca Cola Zero' }, { name: 'Fanta' }
        ]
      },
      {
        title: 'Choose your dip',
        type: 'MULTIPLE',
        maxSelections: 2,
        options: [
          { name: 'Ketchup' }, { name: 'Garlic' }, { name: 'BBQ' }
        ]
      }
    ]
  },
  {
    name: 'Chicken Shawarma Wrap',
    category: 'Wraps',
    description: 'Marinated chicken, garlic sauce, pickles, and fries wrapped in flatbread.',
    price: 9.95,
    imageUrl: 'https://res.cloudinary.com/descwls78/image/upload/v1751168063/cork-grill/meye2hdt6gbeq6sqngiq.jpg',
    customizationGroups: [] // This item has no customizations
  }
];

const categories = [ { name: 'Deals' }, { name: 'Burgers' }, { name: 'Wraps' }, { name: 'Sides' }, { name: 'Drinks' } ];

const importData = async () => {
  try {
    await connectDB();
    // Clear all existing data
    await MenuItem.deleteMany();
    await AdminUser.deleteMany();
    await Category.deleteMany();
    await Promotion.deleteMany();

    // Insert new data
    await Category.insertMany(categories);
    await MenuItem.insertMany(menuItems);
    const adminUser = new AdminUser({ username: 'admin', password: 'password123' });
    await adminUser.save();

    console.log('Data Imported! (New Menu Structure, Admin, Categories)');
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
    await Category.deleteMany();
    await Promotion.deleteMany();
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