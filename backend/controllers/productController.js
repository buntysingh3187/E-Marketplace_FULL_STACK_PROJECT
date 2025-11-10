const Product = require('../models/Product');
const fs = require('fs');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;
    const product = await Product.create({
      seller: req.user._id,
      name,
      description,
      price: Number(price) || 0,
      category,
      stock: Number(stock) || 0,
      image
    });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sortBy } = req.query;
    const filter = { stock: { $gt: 0 } }; // Only show products with stock > 0
    
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    let query = Product.find(filter).populate('seller', 'name email');
    
    // Sorting
    if (sortBy === 'price-asc') query = query.sort({ price: 1 });
    else if (sortBy === 'price-desc') query = query.sort({ price: -1 });
    else if (sortBy === 'rating') query = query.sort({ rating: -1 });
    else if (sortBy === 'newest') query = query.sort({ createdAt: -1 });
    else query = query.sort({ createdAt: -1 }); // Default: newest first
    
    const products = await query;
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.seller.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    const { name, description, price, category, stock } = req.body;
    if (req.file) {
      // delete old image (best-effort)
      if (product.image) {
        const oldPath = product.image.replace(/^\//, '');
        try { fs.unlinkSync(oldPath); } catch (e) {}
      }
      product.image = `/uploads/${req.file.filename}`;
    }
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);

    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.seller.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    // delete image file
    if (product.image) {
      const oldPath = product.image.replace(/^\//, '');
      try { fs.unlinkSync(oldPath); } catch (e) {}
    }
    await product.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};