import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Login route for the web
router.post('/web/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate inputs
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find the user by email and role
    const user = await User.findOne({ email, role });

    if (!user) {
      return res.status(400).json({ message: 'User not found or incorrect role' });
    }

    // Compare the hashed password with the user's stored password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Sign a JWT token with user info and role
    const token = jwt.sign(
      { userId: user._id, role: user.role },  // Add role to the payload for easy access
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expiration time
    );

    // Return the token and role to the frontend
    res.json({
      token,
      role: user.role,  // Role can be used on the frontend to adjust UI or behavior
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
