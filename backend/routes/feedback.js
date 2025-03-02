import express from 'express';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ 
            success: false,
            message: 'No token provided' 
        });
    }

    try {
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || 'fallback_secret_key'
        );
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ 
            success: false,
            message: 'Invalid or expired token' 
        });
    }
};

// Submit Feedback Route
router.post('/', verifyToken, async (req, res) => {
    try {
        const { 
            name, 
            rating, 
            message 
        } = req.body;

        // Validate input
        if (!name || !rating || !message) {
            return res.status(400).json({ 
                success: false,
                message: 'Name, rating, and message are required',
                errors: {
                    name: !name,
                    rating: !rating,
                    message: !message
                }
            });
        }

        // Find user details
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Create new feedback
        const newFeedback = new Feedback({
            userId: user._id,
            name,
            rating,
            message,
            status: 'Pending'
        });

        // Save feedback
        await newFeedback.save();

        // Prepare response matching Android app expectation
        const feedbackResponse = {
            id: newFeedback._id.toString(),
            name: newFeedback.name,
            rating: newFeedback.rating,
            message: newFeedback.message,
            status: newFeedback.status,
            createdAt: newFeedback.createdAt.toISOString()
        };

        res.status(201).json({ 
            success: true,
            message: 'Feedback submitted successfully',
            data: feedbackResponse
        });
    } catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during feedback submission',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
});

// Get Feedback for Admin (optional)
router.get('/', verifyToken, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false,
                message: 'Access denied. Admin rights required' 
            });
        }

        // Fetch all feedbacks
        const feedbacks = await Feedback.find()
            .sort({ createdAt: -1 })
            .limit(50);

        // Transform feedbacks to match Android app expectation
        const formattedFeedbacks = feedbacks.map(feedback => ({
            id: feedback._id.toString(),
            name: feedback.name,
            rating: feedback.rating,
            message: feedback.message,
            status: feedback.status,
            createdAt: feedback.createdAt.toISOString()
        }));

        res.json({ 
            success: true,
            message: 'Feedbacks retrieved successfully',
            data: formattedFeedbacks
        });
    } catch (error) {
        console.error('Error retrieving feedbacks:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error retrieving feedbacks',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
});

export default router;
