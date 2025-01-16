import { Router } from 'express';
import User from '../models/User'; // Assuming your User model is in ./models/User.js
import { hash, compare } from 'bcrypt';
import { createTransport } from 'nodemailer'; // For sending OTP via email
import { randomInt } from 'crypto'; // For generating OTP
import jwt from 'jsonwebtoken'; // For generating JWT tokens for login
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
router.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Generate OTP and store it temporarily (use a DB or cache for real applications)
        const otp = randomInt(100000, 999999).toString();

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create the user
        const newUser = new User({ username, email, password: hashedPassword, otp });
        await newUser.save();

        // Send OTP to the email
        sendOTP(email, otp);

        res.status(201).json({ message: 'User registered. OTP sent to email.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// User Login Route
router.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Check if the password matches
        const isMatch = await compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Forgot Password Route (Send OTP)
router.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Generate OTP for password reset
        const otp = randomInt(100000, 999999).toString();

        // Save OTP temporarily (use a more secure method in production)
        user.otp = otp;
        await user.save();

        // Send OTP to user's email
        sendOTP(email, otp);

        res.status(200).json({ message: 'OTP sent for password reset' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset Password Route (using OTP)
router.post('/api/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Validate input
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Verify OTP
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Hash the new password
        const hashedPassword = await hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = ''; // Clear OTP after reset
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
