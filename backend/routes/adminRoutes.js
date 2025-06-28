const express = require('express');
const router = express.Router();
const { authAdmin } = require('../controllers/adminController');

// When a POST request comes to '/login', use the authAdmin controller function.
router.post('/login', authAdmin);

module.exports = router;