import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';  // Ensure this is the correct path for your auth.js

dotenv.config();  // Load environment variables from .env file

const app = express();

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to GymPro5 API');
});

// Use the authentication routes (register, login, etc.)
app.use('/api/auth', authRoutes);  // Routes for auth actions like register/login

// Optionally: Debugging all available routes
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(r.route.path);  // Log all registered routes
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
