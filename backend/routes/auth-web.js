import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import WebUser from '../models/WebUser.js';
import Gym from '../models/Gym.js';

dotenv.config();

const router = express.Router();

// Web login route
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(`[WEB LOGIN] Login attempt:`, {
      email,
      role,
      passwordLength: password?.length
    });

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

    // Find user and log the query details
    console.log(`[WEB LOGIN] Searching for user with email: ${email} and role: ${role}`);
    
    const user = await WebUser.findOne({ 
      email: email.trim().toLowerCase(), 
      role: role 
    });

    console.log('[WEB LOGIN] User search result:', user ? {
      found: true,
      userId: user._id,
      userEmail: user.email,
      userRole: user.role
    } : 'No user found');

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials or role mismatch' 
      });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    console.log(`[WEB LOGIN] Password validation:`, { validPassword });
    
    if (!validPassword) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // For managers, fetch their associated gym
    let gymData = null;
    if (user.role === 'manager') {
      console.log(`[WEB LOGIN] Fetching gym data for manager ID: ${user._id}`);
      gymData = await Gym.findOne({ managerId: user._id });
      console.log('[WEB LOGIN] Gym data found:', gymData ? true : false);
      
      if (!gymData) {
        return res.status(401).json({ 
          success: false,
          message: 'No associated gym found for this manager' 
        });
      }
    }

    // Generate token
    if (!process.env.JWT_SECRET) {
      console.warn('JWT_SECRET is not set! Using fallback secret. This is not recommended for production.');
    }
    
    const tokenPayload = { 
      userId: user._id, 
      role: user.role,
      email: user.email
    };

    if (gymData) {
      tokenPayload.gymId = gymData._id;
    }

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    console.log(`[WEB LOGIN] Login successful:`, {
      userRole: user.role,
      hasGymData: !!gymData
    });

    const response = { 
      success: true,
      token, 
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };

    if (gymData) {
      response.gym = gymData;
    }

    res.json(response);
    
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
