const Promotion = require('../models/promotionModel');

// @desc    Get all promotions
// @route   GET /api/promotions
// @access  Public (so the main menu can potentially show them)
const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({ isActive: true });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a promotion
// @route   POST /api/promotions
// @access  Private/Admin
const createPromotion = async (req, res) => {
  try {
    const { name, description, type, discountValue, startTime, endTime } = req.body;
    const promotion = new Promotion({
      name,
      description,
      type,
      discountValue,
      startTime,
      endTime,
    });
    const createdPromotion = await promotion.save();
    res.status(201).json(createdPromotion);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create promotion', error: error.message });
  }
};

// @desc    Delete a promotion
// @route   DELETE /api/promotions/:id
// @access  Private/Admin
const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (promotion) {
      res.json({ message: 'Promotion removed' });
    } else {
      res.status(404).json({ message: 'Promotion not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


module.exports = {
  getPromotions,
  createPromotion,
  deletePromotion,
};