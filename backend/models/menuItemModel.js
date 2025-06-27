const mongoose = require('mongoose');

// This is the blueprint for each menu item in our database
const menuItemSchema = new mongoose.Schema(
  {
    // We will add a 'category' field later to link items to categories
    name: {
      type: String,
      required: true, // Every menu item must have a name
      trim: true,     // Removes whitespace from the start and end
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Price cannot be negative
    },
    imageUrl: {
      type: String,
      required: true,
    },
    // This allows us to add customization options later, like "Extra Cheese"
    customizationOptions: [
      {
        name: String,
        price: Number,
      },
    ],
  },
  {
    // This automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

// Create the model from the schema
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;