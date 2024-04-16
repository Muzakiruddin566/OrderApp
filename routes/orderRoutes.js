const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orderController');

// POST route to add a new order
router.post('/add', orderController.addOrder);
router.get('/all', orderController.allOrder);

module.exports = router;
