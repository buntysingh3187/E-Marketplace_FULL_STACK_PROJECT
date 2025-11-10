const Wishlist = require('../models/Wishlist');

exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ buyer: req.user._id }).populate('products');
    if (!wishlist) {
      wishlist = await Wishlist.create({ buyer: req.user._id, products: [] });
    }
    res.json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ buyer: req.user._id });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ buyer: req.user._id, products: [productId] });
    } else {
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ message: 'Already in wishlist' });
      }
      wishlist.products.push(productId);
      await wishlist.save();
    }
    
    await wishlist.populate('products');
    res.json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ buyer: req.user._id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    
    wishlist.products = wishlist.products.filter(p => p.toString() !== req.params.productId);
    await wishlist.save();
    await wishlist.populate('products');
    
    res.json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
