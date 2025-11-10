const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getWishlist);
router.post('/', authMiddleware, addToWishlist);
router.delete('/:productId', authMiddleware, removeFromWishlist);

module.exports = router;
