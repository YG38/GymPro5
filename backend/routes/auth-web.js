import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import WebUser from '../models/WebUser.js'; // Ensure this is the correct model for managers

dotenv.config();  // Load environment variables

const router = express.Router();

// Predefined admin credentials (Replace this with a secure database check in production)
const adminCredentials = {
  email: 'ymebratu64@gmail.com',
  password: 'YoniReact1@mom',
  role: 'admin',
};

// Login route for the web
router.post('/web/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Handle admin login
    if (role === 'admin') {
      if (email !== adminCredentials.email || password !== adminCredentials.password) {
        return res.status(400).json({ message: 'Invalid admin credentials' });
      }

      // Generate JWT token for admin
      const token = jwt.sign(
        { userId: 'admin', role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({ token, role: 'admin' });
    }

    // Handle user login (non-admin)
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: 'User not found or incorrect role' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token for user
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Manager Login Route
router.post('/manager/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email and role
    const user = await WebUser.findOne({ email, role: 'manager' });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials or not a manager' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and return a JWT token
    const token = jwt.sign(
      { userId: user._id, role: 'manager' }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email,
        name: user.name 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to authenticate users via JWT token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export { authenticate };
export default router;
