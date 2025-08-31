const express = require('express');
const router = express.Router();
const { createOrder, getOrderById } = require('../controllers/orderController');

// When a POST request is made to '/create', use the createOrder function
router.post('/create', createOrder);
router.get('/:id', getOrderById);

module.exports = router;