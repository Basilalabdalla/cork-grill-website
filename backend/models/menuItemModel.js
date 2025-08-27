const mongoose = require('mongoose');

// Schema for individual options (e.g., "Coca-Cola", "Extra Cheese")
const optionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
  // This new field will hold the titles of other groups to show when this option is selected.
  unlocksGroups: [{ type: String }],
});

// Schema for groups of options (e.g., "Choose your drink")
const customizationGroupSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['SINGLE', 'MULTIPLE'],
    default: 'SINGLE' 
  },
  maxSelections: { 
    type: Number,
    default: 1,
  },
  options: [optionSchema],
});

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    // This field now has the upgraded schema
    customizationGroups: [customizationGroupSchema], 
  },
  { timestamps: true }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;