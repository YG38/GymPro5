import { Router } from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { createTransport } from 'nodemailer';
import { randomInt } from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Function to send OTP via email
const sendOTP = async (email, otp) => {
    try {
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

        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully');
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
};

// User Registration Route
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Generate OTP and hash the password
        const otp = randomInt(100000, 999999).toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user without username
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            otp,
        });

        // Save the user to the database
        await newUser.save();

        // Send OTP to the user's email
        await sendOTP(email, otp);

        // Return success response
        res.status(201).json({ success: true, message: 'User registered. OTP sent to email.' });
    } catch (err) {
        console.error('Error in /register route:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// User Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Return success response with token
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
        });
    } catch (err) {
        console.error('Error in /login route:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        // Generate OTP
        const otp = randomInt(100000, 999999).toString();

        // Send OTP to the user's email
        await sendOTP(email, otp);

        // Return success response
        res.status(200).json({ success: true, message: 'OTP sent to email.' });
    } catch (err) {
        console.error('Error in /forgot-password route:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;