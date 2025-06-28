const MenuItem = require('../models/menuItemModel');

// @desc    Fetch all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({});
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- NEW ---
// @desc    Create a new menu item
// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = async (req, res) => {
  const { name, description, price, imageUrl } = req.body;

  try {
    const menuItem = new MenuItem({
      name,
      description,
      price,
      imageUrl,
    });

    const createdMenuItem = await menuItem.save();
    res.status(201).json(createdMenuItem);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create menu item', error: error.message });
  }
};

// --- NEW ---
// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateMenuItem = async (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  const menuItem = await MenuItem.findById(req.params.id);

  if (menuItem) {
    menuItem.name = name || menuItem.name;
    menuItem.description = description || menuItem.description;
    menuItem.price = price || menuItem.price;
    menuItem.imageUrl = imageUrl || menuItem.imageUrl;

    const updatedMenuItem = await menuItem.save();
    res.json(updatedMenuItem);
  } else {
    res.status(404).json({ message: 'Menu item not found' });
  }
};

// --- NEW ---
// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res) => {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (menuItem) {
      res.json({ message: 'Menu item removed' });
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
};


module.exports = {
  getMenuItems,
  createMenuItem, // <-- EXPORT NEW
  updateMenuItem, // <-- EXPORT NEW
  deleteMenuItem, // <-- EXPORT NEW
};