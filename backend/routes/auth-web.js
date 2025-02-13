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

    // Handle manager login
    if (role === 'manager') {
      const manager = await WebUser.findOne({ email });
      if (!manager) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, manager.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: manager._id, role: 'manager' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({ token, role: 'manager' });
    }

    // Handle trainer login
    if (role === 'trainer') {
      const trainer = await User.findOne({ email, role: 'trainer' });
      if (!trainer) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, trainer.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: trainer._id, role: 'trainer' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({ token, role: 'trainer' });
    }

    return res.status(400).json({ message: 'Invalid role specified' });
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
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export { authenticate };
export default router;
