const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller'], default: 'buyer' },
    address: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
