import express from 'express';
import mongoose from 'mongoose';
import User from './models/User.js';  // Assuming you have a User model
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();  // Load environment variables from .env file

console.log('MONGODB_URI:', process.env.MONGODB_URI);  // Verify that MONGODB_URI is loaded

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to GymPro5 API');
});

// Use auth routes
app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import { Router } from 'express';
import User from '../models/User.js';  // Ensure path and filename match
import bcrypt from 'bcryptjs';  // Updated import
import { createTransport } from 'nodemailer';
import { randomInt } from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Function to send OTP via email
const sendOTP = (email, otp) => {
    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OTP for Registration',
        text: `Your OTP code is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending OTP:', error);
        } else {
            console.log('OTP sent:', info.response);
        }
    });
};

// User Registration Route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const otp = randomInt(100000, 999999).toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword, otp });
        await newUser.save();

        sendOTP(email, otp);

        res.status(201).json({ message: 'User registered. OTP sent to email.' });
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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error in /login route:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const otp = randomInt(100000, 999999).toString();

        sendOTP(email, otp);

        res.status(200).json({ message: 'OTP sent to email.' });
    } catch (err) {
        console.error('Error in /forgot-password route:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
