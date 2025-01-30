import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'; // Ensure the path to auth.js is correct
import cors from 'cors'; // Add this line at the top

// Enable CORS for all routes
app.use(cors());
dotenv.config(); // Load environment variables from the .env file

const app = express();

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to GymPro5 API');
});

// Use the authentication routes (register, login, etc.)
app.use('/api/auth', authRoutes); // Routes for auth actions like register/login

// Debugging: Log all available routes
app._router.stack.forEach((middleware) => {
    if (middleware.route && middleware.route.path) {
        console.log(`Registered route: ${middleware.route.path}`);
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
