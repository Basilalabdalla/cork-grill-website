const mongoose = require('mongoose');

// This is a new "sub-schema" for individual options like "Coca-Cola" or "Extra Cheese".
// It will be used inside the customization groups.
const optionSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    default: 0 // Price can be 0 (for included options) or an additional charge.
  },
});

// This is a new "sub-schema" for groups of options, like "Choose your drink".
const customizationGroupSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true // e.g., "Make It a Meal" or "Choose up to 2 Dips"
  },
  // 'SINGLE' is for radio buttons (choose one), 'MULTIPLE' is for checkboxes (choose many).
  type: { 
    type: String, 
    required: true, 
    enum: ['SINGLE', 'MULTIPLE'],
    default: 'SINGLE' 
  },
  // This field is for "MULTIPLE" choice, to limit how many can be selected.
  // e.g., For "Choose 2 drinks", this would be 2.
  maxSelections: { 
    type: Number,
    default: 1,
  },
  // This holds the actual list of choices, like "Ketchup", "Garlic", etc.
  options: [optionSchema],
});

// This is your main schema, now with the new 'customizationGroups' field added.
const menuItemSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    category: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    imageUrl: { 
      type: String, 
      required: true 
    },
    // The new field that holds all customization data for an item.
    customizationGroups: [customizationGroupSchema], 
  },
  { timestamps: true }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;