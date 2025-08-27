const Promotion = require('../models/promotionModel');

const getPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.find({}).sort({ createdAt: -1 });
        res.json(promotions);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const createPromotion = async (req, res) => {
    try {
        // --- THIS IS THE FIX ---
        // We now correctly accept 'imageUrl' from the request body
        const { name, description, type, discountValue, startTime, endTime, imageUrl } = req.body;
        
        const promotion = new Promotion({
            name,
            description,
            type,
            discountValue,
            startTime,
            endTime,
            imageUrl // And we pass it to the new Promotion object
        });
        const createdPromotion = await promotion.save();
        res.status(201).json(createdPromotion);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create promotion', error: error.message });
    }
};

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