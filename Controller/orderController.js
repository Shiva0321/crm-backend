const Order = require("../Models/Order");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const {
      orderId,
      email,
      productName,
      price,
      quantity = 1, // Default quantity is 1
      status = "Pending", // Default status is "Pending"
    } = req.body;

    // Ensure the customer exists in the database using their email
    const customer = await User.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Create a new order with the provided details
    const newOrder = new Order({
      orderId,
      customerId: customer._id, // Link the order to the customer's ID
      email,
      productName,
      price,
      quantity,
      status,
    });

    // Save the order in the database
    await newOrder.save();

    // Respond with success message and the created order
    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    // Fetch all orders from the database and populate customer details (email, phone)
    const orders = await Order.find().populate("customerId", "email phone");
    res.status(200).json(orders); // Send the orders as the response
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

// Get orders for a specific email with optional search filters
const getOrdersByEmail = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract the token from Authorization header

  if (!token) {
    return res.status(403).json({ message: "Token is required" }); // Respond if token is missing
  }

  try {
    // Verify the token and decode the user information
    const decoded = jwt.verify(token, "your_jwt_secret");

    // Fetch orders associated with the logged-in user's email
    const orders = await Order.find({ email: decoded.email });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    // Respond with the user's orders
    res.json(orders);
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an order by its orderId
const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Find and delete the order using the provided orderId
    const order = await Order.findOneAndDelete({ orderId: orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" }); // Respond if order doesn't exist
    }

    res.status(200).json({ message: "Order deleted successfully" }); // Respond with success
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting order, please try again later." });
  }
};

// Update the quantity of an order
const updateOrderQuantity = async (req, res) => {
  const { orderId } = req.params;
  const { action } = req.body;

  try {
    // Find the order by its orderId
    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" }); // Respond if order doesn't exist
    }

    // Update the quantity based on the specified action
    if (action === "increase") {
      order.quantity += 1; // Increase quantity
    } else if (action === "decrease" && order.quantity > 1) {
      order.quantity -= 1; // Decrease quantity
    } else {
      return res
        .status(400)
        .json({ message: "Invalid action or quantity already 1" });
    }

    await order.save(); // Save the updated order
    res.status(200).json({ message: "Quantity updated successfully", order }); // Respond with success
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating order quantity, please try again later.",
    });
  }
};

// Export the controller functions
module.exports = {
  createOrder,
  getOrders,
  getOrdersByEmail,
  deleteOrder,
  updateOrderQuantity,
};
