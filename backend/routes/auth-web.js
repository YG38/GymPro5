import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import WebUser from '../models/WebUser.js';

dotenv.config();

const router = express.Router();

// Web login route
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(`[WEB LOGIN] Attempt - Email: ${email}, Role: ${role}`);

    // Validate input
    if (!email || !password) {
      console.log('[WEB LOGIN] Missing email or password');
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Handle admin login
    if (role === 'admin') {
      console.log('[WEB LOGIN] Admin login attempt');
      if (email === 'ymebratu64@gmail.com' && password === 'YoniReact1@mom') {
        const token = jwt.sign(
          { userId: 'admin', role: 'admin', email: email },
          process.env.JWT_SECRET || 'fallback_secret',
          { expiresIn: '24h' }
        );
        console.log('[WEB LOGIN] Admin login successful');
        return res.json({ 
          success: true,
          token, 
          role: 'admin',
          user: { email }
        });
      }
      console.log('[WEB LOGIN] Invalid admin credentials');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid admin credentials' 
      });
    }

    // Handle other users
    const user = await WebUser.findOne({ 
      email: email.trim().toLowerCase(), 
      role: role 
    });

    if (!user) {
      console.log(`[WEB LOGIN] No user found - Email: ${email}, Role: ${role}`);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log(`[WEB LOGIN] Password mismatch - Email: ${email}`);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    console.log(`[WEB LOGIN] Successful - Email: ${email}, Role: ${user.role}`);
    res.json({ 
      success: true,
      token, 
      role: user.role,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('[WEB LOGIN] Server error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

export default router;
