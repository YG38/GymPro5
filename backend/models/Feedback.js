import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    category: {
        type: String,
        enum: ['Bug', 'Feature Request', 'Performance', 'User Experience', 'Other'],
        required: true
    },
    deviceInfo: {
        type: Object,
        default: {}
    },
    status: {
        type: String,
        enum: ['Pending', 'In Review', 'Resolved', 'Closed'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

export default Feedback;
