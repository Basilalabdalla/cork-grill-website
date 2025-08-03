const express = require('express');
const router = express.Router();
const { getHomePageContent, updateHomePageContent } = require('../controllers/homePageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getHomePageContent);
router.put('/', protect, updateHomePageContent);

module.exports = router;