// app.js
const express = require('express');
const connectDB = require('./config/db');  // Assuming you have a config to connect to MongoDB
const authRoutes = require('./routes/auth');  // Import routes for authentication
const trainerRoutes = require('./routes/trainerRoutes');  // Import trainer routes
require('dotenv').config();
const cors = require('cors');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());  // Middleware to parse incoming JSON requests
app.use(cors());  // Enable CORS for all domains (you can restrict it if needed)

// Routes
app.use('/api/auth', authRoutes);  // Use auth routes for /api/auth/*
app.use('/api/trainer', trainerRoutes);  // Use trainer routes for /api/trainer/*

// Basic route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
