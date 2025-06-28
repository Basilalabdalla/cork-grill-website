const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');

// When a POST request is made to '/create', use the createOrder function
router.post('/create', createOrder);

module.exports = router;