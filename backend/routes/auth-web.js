import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Predefined login credentials for admin
const adminCredentials = {
  email: 'ymebratu64@gmail.com',
  password: 'YoniReact1@mom',
  role: 'admin'
};

// Login route for the web
router.post('/web/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate inputs
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the role is admin and use predefined credentials
    if (role === 'admin') {
      if (email !== adminCredentials.email || password !== adminCredentials.password) {
        return res.status(400).json({ message: 'Invalid admin credentials' });
      }
      
      // Admin credentials match, create a token and respond
      const token = jwt.sign(
        { userId: 'admin', role: 'admin' },  // Admin info
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expiration time
      );

      return res.json({
        token,
        role: 'admin',
      });
    }

    // If not admin, check for user in database by email and role
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
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return the token and role to the frontend
    res.json({
      token,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
