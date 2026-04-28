const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  placedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'confirmed' },
  items: [orderItemSchema],
  total: { type: Number, required: true }
});

module.exports = mongoose.model('Order', orderSchema);
