const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.createReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;
    
    if (!rating || !comment || !productId || !orderId) {
      return res.status(400).json({ message: 'All fields required' });
    }
    
    // Check if order exists and is delivered
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Can only review delivered products' });
    }
    
    // Check if already reviewed
    const existingReview = await Review.findOne({ product: productId, buyer: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: 'Already reviewed this product' });
    }
    
    // Create review
    const review = await Review.create({
      product: productId,
      buyer: req.user._id,
      order: orderId,
      rating: Number(rating),
      comment
    });
    
    // Update product rating
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      numReviews: reviews.length
    });
    
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('buyer', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const productId = review.product;
    await review.deleteOne();
    
    // Update product rating
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
    
    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      numReviews: reviews.length
    });
    
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
