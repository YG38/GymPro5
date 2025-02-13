import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import WebUser from '../models/WebUser.js';

dotenv.config();

const router = express.Router();

// Web login route
router.post('/web/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Handle admin login
    if (role === 'admin') {
      if (email === 'ymebratu64@gmail.com' && password === 'YoniReact1@mom') {
        const token = jwt.sign(
          { userId: 'admin', role: 'admin' },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
        return res.json({ token, role: 'admin' });
      }
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Handle other users
    const user = await WebUser.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
