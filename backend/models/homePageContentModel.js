const mongoose = require('mongoose');

const homePageContentSchema = new mongoose.Schema({
  // We use a fixed key to ensure there's only one homepage document
  singletonKey: { 
    type: String, 
    default: 'main', 
    unique: true 
  },
  
  // An array of menu item IDs that the admin has marked as 'popular'
  popularItemIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MenuItem' 
  }],

  // A simple object to store opening hours
  openingHours: {
    weekdays: { type: String, default: '11:00 AM - 9:00 PM' },
    weekends: { type: String, default: '11:00 AM - 10:00 PM' },
  },

isStoreOpen: {
    type: Boolean,
    default: true, // Default to being open
  },
}, { timestamps: true });

const HomePageContent = mongoose.model('HomePageContent', homePageContentSchema);
module.exports = HomePageContent;