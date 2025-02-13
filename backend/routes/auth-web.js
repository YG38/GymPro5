import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import WebUser from '../models/WebUser.js';
import Gym from '../models/Gym.js'; 

dotenv.config();  // Load environment variables

const router = express.Router();

// Predefined admin credentials (Replace this with a secure database check in production)
const adminCredentials = {
  email: 'ymebratu64@gmail.com',
  password: 'YoniReact1@mom',
  role: 'admin',
};

// Improved login route for the web
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
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }

      // Generate JWT token for admin
      const token = jwt.sign({ userId: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token, role: 'admin' });
    }

    // Handle user login (non-admin)
    const user = await WebUser.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ message: 'User not found or incorrect role' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token for user
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Manager/Admin login route
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log('Login attempt:', { email, role });

    // Find user by email
    const user = await WebUser.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the role matches
    if (user.role !== role) {
      return res.status(401).json({ error: 'Invalid role for this user' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If it's a manager, get their gym information
    let gymInfo = null;
    if (role === 'manager') {
      const gym = await Gym.findOne({ 'manager.userId': user._id });
      console.log('Found gym for manager:', gym);
      if (gym) {
        gymInfo = {
          id: gym._id.toString(),
          name: gym.gymName,
          location: gym.location,
          price: gym.price,
          logo: gym.logo
        };
      }
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        gymId: gymInfo?.id
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const responseData = {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      gym: gymInfo
    };

    console.log('Sending login response:', responseData);
    res.json(responseData);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error during login' });
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
