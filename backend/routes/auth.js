import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        console.log(`[REGISTER] Attempt - Email: ${email}`);

        // Validate input
        if (!firstName || !lastName || !email || !password) {
            console.log('[REGISTER] Missing required fields');
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required',
                fields: {
                    firstName: !firstName,
                    lastName: !lastName,
                    email: !email,
                    password: !password
                }
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            console.log(`[REGISTER] Invalid email format: ${email}`);
            return res.status(400).json({ 
                success: false,
                message: 'Invalid email format' 
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
        if (existingUser) {
            console.log(`[REGISTER] User already exists: ${email}`);
            return res.status(400).json({ 
                success: false,
                message: 'User already exists with this email' 
            });
        }

        // Validate password strength
        if (password.length < 6) {
            console.log('[REGISTER] Password too short');
            return res.status(400).json({ 
                success: false,
                message: 'Password must be at least 6 characters long' 
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ 
            firstName: firstName.trim(), 
            lastName: lastName.trim(), 
            email: email.trim().toLowerCase(), 
            password: hashedPassword,
            createdAt: new Date()
        });

        // Save the user to the database
        await newUser.save();

        // Generate token for immediate login
        const secret = process.env.JWT_SECRET || 'fallback_secret_key';
        const token = jwt.sign(
            { 
                id: newUser._id, 
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName
            }, 
            secret, 
            { expiresIn: '1h' }
        );

        console.log(`[REGISTER] User registered successfully: ${email}`);
        res.status(201).json({ 
            success: true,
            message: 'User registered successfully',
            token: token,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('[REGISTER] Server error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`[LOGIN] Attempt for email: ${email}`);
        console.log(`[LOGIN] Request body: ${JSON.stringify(req.body)}`);

        if (!email || !password) {
            console.log('[LOGIN] Missing email or password');
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required' 
            });
        }

        // Find user with exact email match
        const user = await User.findOne({ email: email.trim() });
        if (!user) {
            console.log(`[LOGIN] No user found with email: ${email}`);
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Log user details for debugging
        console.log(`[LOGIN] User found: ${JSON.stringify({
            id: user._id,
            email: user.email,
            hashedPasswordLength: user.password.length
        })}`);

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`[LOGIN] Password match result: ${isMatch}`);

        if (!isMatch) {
            console.log(`[LOGIN] Password mismatch for email: ${email}`);
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Generate token
        const secret = process.env.JWT_SECRET || 'fallback_secret_key';
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }, 
            secret, 
            { expiresIn: '1h' }
        );

        console.log(`[LOGIN] Successful for email: ${email}`);
        res.json({
            success: true,
            token: token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            },
            message: 'Login successful'
        });
    } catch (error) {
        console.error('[LOGIN] Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
});

// Authentication middleware (to verify token)
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = decoded; // Attach the decoded user info to the request
        next();
    });
};

// Change Password Route with Token Authentication
router.post('/change-password', verifyToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id; // Get the user ID from the token

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findById(userId); // Find user by ID from token
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid old password' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Account Route
router.delete('/delete-account', express.json(), verifyToken, async (req, res) => {
    try {
        const { email } = req.body;  // Get email from request body

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Now, we check if the user trying to delete the account matches the token (email from token)
        if (email !== req.user.email) {
            return res.status(403).json({ message: 'You are not authorized to delete this account' });
        }

        // Find and delete the user by email
        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error("❌ Error in /delete-account:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
