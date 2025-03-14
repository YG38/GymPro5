import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import validator from 'validator';

dotenv.config();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("⚠️ JWT_SECRET is missing in environment variables!");
}

// Rate limiter for login and register
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { success: false, message: "Too many attempts, please try again later." }
});

// ✅ Utility function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// ✅ Register Route
router.post('/register', authLimiter, async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        console.log(`[REGISTER] Attempt - Email: ${email}`);

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!validator.isEmail(email.trim())) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        // Normalize email
        const normalizedEmail = validator.normalizeEmail(email);

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }

        // Strong password validation
        if (!validator.isStrongPassword(password, { minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long and contain an uppercase letter, number, and symbol"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            createdAt: new Date()
        });

        await newUser.save();
        const token = generateToken(newUser);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: { id: newUser._id, firstName, lastName, email: normalizedEmail }
        });
    } catch (error) {
        console.error('[REGISTER] Server error:', error);
        res.status(500).json({ success: false, message: "Server error during registration" });
    }
});

// ✅ Login Route
router.post('/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`[LOGIN] Attempt for email: ${email}`);

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const normalizedEmail = validator.normalizeEmail(email);
        const user = await User.findOne({ email: normalizedEmail });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(user);
        res.json({
            success: true,
            token,
            user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
            message: "Login successful"
        });
    } catch (error) {
        console.error('[LOGIN] Error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ✅ Middleware to Verify Token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Access Denied: No token provided" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid or expired token" });

        req.user = decoded;
        next();
    });
};

// ✅ Change Password Route
router.post('/change-password', verifyToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findById(req.user.id);
        if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
            return res.status(400).json({ message: "Invalid old password" });
        }

        if (!validator.isStrongPassword(newPassword, { minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
            return res.status(400).json({ message: "Password must be strong (uppercase, number, and symbol)" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Delete Account Route
router.delete('/delete-account', verifyToken, async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || email !== req.user.email) {
            return res.status(403).json({ message: "Unauthorized request" });
        }

        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("❌ Error in /delete-account:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
