import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js'; // Import your auth routes

// Initialize express app
const app = express();

// Load environment variables
dotenv.config();

// CORS Configuration
app.use(cors({
  origin: "http://gym-pro5.vercel.app/", // Allow all origins (replace with your frontend URL for production)
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true, // Allow cookies and credentials
}));

// Middleware to log request data
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log('Request Body:', req.body);
  next();
});

// Middleware
app.use(express.json());

// Add this before mongoose.connect to check environment variables
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch(error => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Exit the process if MongoDB fails to connect
  });


// Routes
app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Welcome to GymPro5 API' });
});

// Mount auth routes
app.use('/api/auth', authRoutes);

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);  // Log the error stack trace
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
});
