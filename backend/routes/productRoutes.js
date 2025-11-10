const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const productCtrl = require('../controllers/productController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});
const upload = multer({ storage });

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
