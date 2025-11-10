const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body; // [{ product: id, quantity }]
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'No items' });
    if (!shippingAddress) return res.status(400).json({ message: 'Shipping address required' });

    // Build items with price and seller
    const populatedItems = [];
    let total = 0;
    for (const it of items) {
      const p = await Product.findById(it.product);
      if (!p) return res.status(400).json({ message: `Product not found: ${it.product}` });
      const qty = Number(it.quantity) || 1;
      const price = p.price;
      populatedItems.push({ product: p._id, quantity: qty, price, seller: p.seller });
      total += price * qty;
    }

    const order = await Order.create({ 
      buyer: req.user._id, 
      items: populatedItems, 
      total,
      shippingAddress,
      paymentMethod: 'COD'
    });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrdersForBuyer = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).populate('items.product');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrdersForSeller = async (req, res) => {
  try {
    // Find orders where seller's products were sold
    const orders = await Order.find({ 'items.seller': req.user._id })
      .populate('buyer', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });
    
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Check if seller has products in this order
    const hasSellersProduct = order.items.some(item => item.seller.toString() === req.user._id.toString());
    if (!hasSellersProduct) return res.status(403).json({ message: 'Not authorized' });
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // If order is being confirmed for the first time, decrease stock
    if (status === 'confirmed' && order.status === 'pending') {
      for (const item of order.items) {
        // Only decrease stock for this seller's products
        if (item.seller.toString() === req.user._id.toString()) {
          const product = await Product.findById(item.product);
          if (product) {
            product.stock = Math.max(0, product.stock - item.quantity);
            await product.save();
          }
        }
      }
    }
    
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};