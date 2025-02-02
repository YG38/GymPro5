import { Router } from 'express';
import User from '../models/User.js';
import Gym from '../models/Gym.js';  // Assuming you have a Gym model for gym registration
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Change Password Route
router.post('/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ 
      success: false, 
      message: 'Both old and new passwords are required' 
    });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid old password' 
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters' 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Password updated successfully' 
    });

  } catch (err) {
    console.error('Error in /change-password route:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Delete Account Route
router.delete('/delete-account', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Account deleted permanently' 
    });

  } catch (err) {
    console.error('Error in /delete-account route:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Gym Registration Route
router.post('/gym/register', async (req, res) => {
  const { firstName, lastName, username, userEmail, userPhone, membershipPlan } = req.body;

  if (!firstName || !lastName || !username || !userEmail || !userPhone || !membershipPlan) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required for gym registration' 
    });
  }

  try {
    // You could add validation for user existence here if required
    const gymRegistration = new Gym({
      firstName,
      lastName,
      username,
      userEmail,
      userPhone,
      membershipPlan
    });

    await gymRegistration.save();
    res.status(201).json({ 
      success: true, 
      message: 'Gym registration successful', 
      gymRegistration 
    });
  } catch (err) {
    console.error('Error in /gym/register route:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

export default router;
