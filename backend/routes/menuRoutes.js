const express = require('express');
const router = express.Router();
const { getMenuItems } = require('../controllers/menuController');

// When a GET request is made to the root of this route ('/'),
// it will be handled by the getMenuItems controller function.
router.get('/', getMenuItems);

module.exports = router;