import express from 'express';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Submit Feedback Route
router.post('/submit', verifyToken, async (req, res) => {
    try {
        const { 
            message, 
            rating, 
            category, 
            deviceInfo 
        } = req.body;

        // Validate input
        if (!message || !rating || !category) {
            return res.status(400).json({ 
                success: false,
                message: 'Message, rating, and category are required' 
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
            userName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            message,
            rating,
            category,
            deviceInfo: deviceInfo || {},
            status: 'Pending'
        });

        // Save feedback
        await newFeedback.save();

        res.status(201).json({ 
            success: true,
            message: 'Feedback submitted successfully',
            feedbackId: newFeedback._id
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

// Get Feedback for Admin Dashboard
router.get('/admin', verifyToken, async (req, res) => {
    try {
        // Check if user is admin (you might want to add a role check middleware)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false,
                message: 'Access denied. Admin rights required' 
            });
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filtering options
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.category) filter.category = req.query.category;

        // Fetch feedbacks
        const feedbacks = await Feedback.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Count total feedbacks
        const total = await Feedback.countDocuments(filter);

        res.json({
            success: true,
            data: feedbacks,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalFeedbacks: total
            }
        });
    } catch (error) {
        console.error('Fetching feedbacks error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error fetching feedbacks',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
});

// Update Feedback Status (for admin)
router.patch('/admin/:id', verifyToken, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false,
                message: 'Access denied. Admin rights required' 
            });
        }

        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['Pending', 'In Review', 'Resolved', 'Closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid status' 
            });
        }

        // Update feedback
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        );

        if (!updatedFeedback) {
            return res.status(404).json({ 
                success: false,
                message: 'Feedback not found' 
            });
        }

        res.json({ 
            success: true,
            message: 'Feedback status updated',
            feedback: updatedFeedback
        });
    } catch (error) {
        console.error('Updating feedback status error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error updating feedback status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
});

export default router;
