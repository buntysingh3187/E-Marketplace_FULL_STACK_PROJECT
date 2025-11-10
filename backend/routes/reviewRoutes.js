const express = require('express');
const router = express.Router();
const { createReview, getProductReviews, deleteReview } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createReview);
router.get('/product/:productId', getProductReviews);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;
