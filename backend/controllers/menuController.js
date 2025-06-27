const MenuItem = require('../models/menuItemModel');

// @desc    Fetch all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    // Use the MenuItem model to find all documents in its collection
    const menuItems = await MenuItem.find({});

    // Send the found items back to the client as JSON
    res.json(menuItems);
  } catch (error) {
    console.error(`Error fetching menu items: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Export the function so our routes can use it
module.exports = {
  getMenuItems,
};