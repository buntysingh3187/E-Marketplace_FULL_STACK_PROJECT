const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const orderCtrl = require('../controllers/orderController');

// Create order (buyer)
router.post('/', auth, orderCtrl.createOrder);

// Buyer orders
router.get('/my', auth, orderCtrl.getOrdersForBuyer);

// Seller view orders containing their products
router.get('/seller', auth, orderCtrl.getOrdersForSeller);

// Update order status (seller)
router.patch('/:id/status', auth, orderCtrl.updateOrderStatus);

module.exports = router;
