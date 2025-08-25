const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const MenuItem = require('./models/menuItemModel');
const AdminUser = require('./models/adminUserModel');
const Category = require('./models/categoryModel');
const Promotion = require('./models/promotionModel');
const HomePageContent = require('./models/homePageContentModel');

dotenv.config();

// This is the default sample data for a fresh local setup
const menuItems = [
    { name: 'Cork Cheese Burger', category: 'Burgers', description: '6oz Irish beef patty, cheese, lettuce, onion, tomato, and house sauce.', price: 10.97, imageUrl: 'https://res.cloudinary.com/descwls78/image/upload/v1751323326/cork-grill/h2bkhryhjgwbxi9gnvbt.jpg' },
    { name: 'Double Chicken Burger', category: 'Burgers', description: 'Crispy fried chicken, spicy slaw, pickles, and chili mayo.', price: 11.50, imageUrl: 'https://res.cloudinary.com/descwls78/image/upload/v1751323326/cork-grill/cduxprgfomhdqgnajs6t.jpg' },
    { name: 'Chicken Shawarma Wrap', category: 'Wraps', description: 'Marinated chicken, garlic sauce, pickles, and fries wrapped in flatbread.', price: 9.95, imageUrl: 'https://res.cloudinary.com/descwls78/image/upload/v1751168063/cork-grill/meye2hdt6gbeq6sqngiq.jpg' },
    { name: 'The Meal Deal', category: 'Offers and Deals', description: 'Choose any burger, a side of fries, and a soft drink.', price: 15.00, imageUrl: 'https://res.cloudinary.com/descwls78/image/upload/v1751323326/cork-grill/xpkdmhncpt42lwtfuquw.jpg' },
    { name: 'Falafel Wrap', category: 'Wraps', description: 'Homemade falafel, hummus, lettuce, tomato, and tahini sauce.', price: 9.50, imageUrl: 'https://res.cloudinary.com/descwls78/image/upload/v1751168091/cork-grill/ypok3exn49nj0liy6m4w.jpg' }
];

const categories = [ { name: 'Burgers' }, { name: 'Chicken Nuggets' }, { name: 'Chips' }, { name: 'Drinks' }, { name: 'Hot Dogs' }, { name: 'Kebab' }, { name: 'Offers and Deals' }, { name: 'Sauce or Dips' }, { name: 'Skewers' }, { name: 'Wraps' } ];

const importData = async () => {
  try {
    await connectDB();
    
    await MenuItem.deleteMany();
    await AdminUser.deleteMany();
    await Category.deleteMany();
    await Promotion.deleteMany();
    await HomePageContent.deleteMany();
    console.log('--- Old data cleared ---');

    await Category.insertMany(categories);
    await MenuItem.insertMany(menuItems);
    await HomePageContent.create({});

    const adminUser = new AdminUser({ username: 'admin', password: 'password123' });
    await adminUser.save();
    console.log('--- New data and default admin user created ---');

    console.log('✅ Data Import Complete!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error during data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  // ... (You can add the destroy logic here if you wish)
  console.log('Destroy function is not implemented in this version.');
  process.exit();
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}