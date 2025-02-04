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

        // Check if all required fields are provided
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with firstName and lastName
        const newUser = new User({ 
            firstName, 
            lastName, 
            email, 
            password: hashedPassword 
        });

        // Save the user to the database
        await newUser.save();

        // Respond with success message
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create a JWT token
        const token = jwt.sign({ id: user._id }, 'yourSecretKey', { expiresIn: '1h' });

        res.json({
            success: true,
            token: token, // Send token in response
            message: 'Login successful'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
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

// DELETE Account Route with Email Validation and Authentication
router.delete(
    '/delete-account',
    express.json(),
    body('email').isEmail().withMessage('Invalid email format'), // Validate email format
    async (req, res) => {
        try {
            // Validate the request body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array()[0].msg });
            }

            // Get email and token from the request
            const { email } = req.body;
            const token = req.headers['authorization']; // Assuming JWT token is in the header

            // Validate if email and token are provided
            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }

            if (!token) {
                return res.status(401).json({ message: 'Authorization token is missing' });
            }

            // Verify the JWT token
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (!decoded) {
                    return res.status(403).json({ message: 'Invalid token' });
                }

                // Proceed to delete the user account
                const user = await User.findOneAndDelete({ email });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                res.status(200).json({ message: 'Account deleted successfully' });
            } catch (error) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }

        } catch (error) {
            console.error("❌ Error in /delete-account:", error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

export default router;
