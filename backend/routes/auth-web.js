import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
router.post('/web/login', async (req, res) => {
  try {
    console.log('Received login request:', req.body);  // Log the request body

    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: 'User not found or incorrect role' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,                                                                                                                   
      { expiresIn: '1h' }
    );

    res.json({
      token,
      role: user.role,
    });
  } catch (error) {
    console.error('Error:', error);  // Log the error to the console
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
