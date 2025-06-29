const express = require('express');
const router = express.Router();
const { 
  getPromotions, 
  createPromotion, 
  deletePromotion 
} = require('../controllers/promotionController');
const { protect } = require('../middleware/authMiddleware');

// Anyone can view active promotions
router.get('/', getPromotions);

// Only admins can create or delete promotions
router.post('/', protect, createPromotion);
router.delete('/:id', protect, deletePromotion);

module.exports = router;