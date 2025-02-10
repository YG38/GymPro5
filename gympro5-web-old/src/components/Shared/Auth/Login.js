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

    // Check for a predefined admin login (for testing)
    if (email === "admin@example.com" && password === "yourpassword" && role === "admin") {
      // Create a token
      const token = jwt.sign({ userId: "admin", role: "admin" }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token, role: "admin" });
    }

    // Check for other users in DB
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: 'User not found or incorrect role' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
