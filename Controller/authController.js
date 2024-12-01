const jwt = require('jsonwebtoken');
const User = require('../Models/User');

// Login Controller
const login = async (req, res) => {
  const { email, phone, password } = req.body;

  try {
    let user;

    // Check if user exists using email or phone
    if (email) {
      user = await User.findOne({ email }); // Find user by email
    } else if (phone) {
      user = await User.findOne({ phone }); // Find user by phone
    }

    // If no user is found, return an error
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored password
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid credentials' }); // Return error if password doesn't match
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Payload: user ID and email
      'your_jwt_secret', // Secret key for signing the token
      { expiresIn: '24h' } // Token validity duration
    );
    
    console.log(`New Token: ${token}`); // Log the token for debugging purposes

    // Respond with the token and a success message
    res.json({ 
      message: 'Login successful', 
      token,  // Send the generated JWT token in the response
      // refreshToken // Uncomment if implementing a refresh token mechanism
    });
  } catch (error) {
    console.error(error); // Log any errors that occur during the process
    res.status(500).json({ message: 'Server error' }); // Respond with a server error message
  }
};

// Export the login function
module.exports = { login };
