import { Router } from 'express';
import User from '../models/User.js';  // Ensure path and filename match
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// User Registration Route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error in /register route:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// User Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error in /login route:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Change Password Route
router.post('/change-password', async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid old password' });

        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'New password must be at least 8 characters long' });
        }

        user.password = await hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Error in /change-password route:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Account Route
router.delete('/delete-account', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOneAndDelete({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Error in /delete-account route:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
