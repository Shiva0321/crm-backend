const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true }, // Add customerEmail for easy lookup
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 }, // New field for quantity
  status: { type: String, default: 'Pending' },
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
