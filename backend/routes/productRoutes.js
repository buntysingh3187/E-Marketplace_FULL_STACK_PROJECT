const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const productCtrl = require('../controllers/productController');
const upload = require('../config/multer');

// Public
router.get('/', productCtrl.getProducts);
// Seller's own products (protected)
router.get('/seller', auth, async (req, res) => {
  try {
    const products = await require('../models/Product').find({ seller: req.user._id });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/:id', productCtrl.getProductById);

// Protected seller routes
router.post('/', auth, upload.single('image'), productCtrl.createProduct);
router.put('/:id', auth, upload.single('image'), productCtrl.updateProduct);
router.delete('/:id', auth, productCtrl.deleteProduct);

module.exports = router;
