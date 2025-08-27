const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  // We'll start with 'PERCENT_DISCOUNT' and can add more later (e.g., 'BOGO')
  type: {
    type: String,
    required: true,
    enum: ['PERCENT_DISCOUNT'], // Defines allowed values
    default: 'PERCENT_DISCOUNT',
  },
  imageUrl: {
  type: String,
  required: false, // Make it optional
  },
  // The discount value, e.g., 10 for a 10% discount
  discountValue: {
    type: Number,
    required: true,
  },
  // The dates during which the promotion is active
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Promotion = mongoose.model('Promotion', promotionSchema);
module.exports = Promotion;