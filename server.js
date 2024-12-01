const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./Routers/authRoutes');
const orderRoutes = require('./Routers/orderRoutes');
const authMiddleware = require('./authMiddleware');
const app = express();


// Middleware to parse JSON requests
app.use(express.json());



// CORS options to allow requests from the frontend
const corsOptions = {
  origin: 'https://crm-task1.netlify.app', // Frontend origin
  methods: 'GET,POST,PUT,DELETE,PATCH', // Allowed HTTP methods
  credentials: true, // Enable credentials (cookies or headers) for cross-origin requests
};



app.use(cors(corsOptions)); // Enable CORS with the defined options


// Define API routes
app.use('/api/login', authRoutes); // Authentication routes
app.use('/api', orderRoutes); // Order-related routes
// app.use('/api', authMiddleware, orderRoutes); // Uncomment to add authentication middleware for protected routes



// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/your-db', {
  useNewUrlParser: true, // Use the new MongoDB connection string parser
  useUnifiedTopology: true, // Use the new topology engine
}).then(() => {
  console.log('MongoDB connected'); // Log success message upon successful connection
}).catch(err => {
  console.log('Failed to connect to MongoDB', err); // Log error message if connection fails
});


// Start the Express server
app.listen(5000, () => {
  console.log('Server running on port 5000'); // Log message when the server starts successfully
});
