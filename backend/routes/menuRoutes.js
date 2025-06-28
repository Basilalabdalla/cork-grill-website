const express = require('express');
const router = express.Router();
const { 
    getMenuItems, 
    createMenuItem, 
    updateMenuItem, 
    deleteMenuItem 
} = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware'); // <-- IMPORT protect

// --- Public Route ---
// Anyone can view the menu
router.get('/', getMenuItems);

// --- Protected Admin Routes ---
// Only a logged-in admin can create, update, or delete items.
router.post('/', protect, createMenuItem);
router.put('/:id', protect, updateMenuItem);
router.delete('/:id', protect, deleteMenuItem);

module.exports = router;