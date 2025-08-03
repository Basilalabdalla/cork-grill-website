const HomePageContent = require('../models/homePageContentModel');

// @desc    Get the homepage content (popular items, hours)
// @route   GET /api/homepage
// @access  Public
const getHomePageContent = async (req, res) => {
  try {
    // Find the content, or create it if it doesn't exist yet
    let content = await HomePageContent.findOne({ singletonKey: 'main' })
      .populate('popularItemIds'); // This replaces the IDs with the full menu item objects

    if (!content) {
      content = await HomePageContent.create({ singletonKey: 'main' });
    }
    res.json(content);
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update the homepage content
// @route   PUT /api/homepage
// @access  Private/Admin
const updateHomePageContent = async (req, res) => {
  try {
    const { popularItemIds, openingHours } = req.body;
    
    const content = await HomePageContent.findOneAndUpdate(
      { singletonKey: 'main' },
      { popularItemIds, openingHours },
      { new: true, upsert: true } // Options: return the new version, create if it doesn't exist
    ).populate('popularItemIds');

    res.json(content);
  } catch (error) {
    console.error('Error updating homepage content:', error);
    res.status(400).json({ message: 'Failed to update content', error: error.message });
  }
};

module.exports = { getHomePageContent, updateHomePageContent };