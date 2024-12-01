const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrdersByEmail,
  updateOrderQuantity,
  deleteOrder,
  getOrders,
} = require('../Controller/orderController');

// Routes
router.post('/createorders', createOrder); // Create a new order
router.get('/ordersbyemail', getOrdersByEmail); // Get orders for logged-in user
router.get('/getorders', getOrders);            // Get all the order.
router.patch('/updatequantity/:orderId', updateOrderQuantity); // Update order quantity
router.delete('/deleteorders/:orderId', deleteOrder); // Delete an order by ID

module.exports = router;
