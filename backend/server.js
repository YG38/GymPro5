import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs'; // Added for file cleanup
import authRoutes from './routes/auth.js'; // Android app authentication
import authWebRoutes from './routes/auth-web.js'; // Web app authentication
import gymRoutes from './routes/gym.js'; // Gym routes

// Initialize express app
const app = express();

// Load environment variables
dotenv.config();

// Ensure required environment variables are set
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in .env file!");
  process.exit(1);
} else {
  console.log('✅ MONGODB_URI loaded successfully');
}

// CORS Configuration - Allow both local and production
const allowedOrigins = ["http://gym-pro5.vercel.app", "http://localhost:5173"];
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Log request details for debugging
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  if (req.method !== 'GET') {
    console.log('Request Body:', req.body);
  }
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(error => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Welcome to GymPro5 API' });
});

// Authentication Routes
app.use('/api/auth', authRoutes); // Android app authentication
app.use('/api/auth-web', authWebRoutes); // Web app authentication

// Gym Routes (For AddGymForm)
app.use('/api/web', gymRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found` 
  });
});

// Global Error Handling
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  console.error('Stack:', err.stack);
  
  // Clean up any uploaded files if there's an error
  if (req.file) {
    try {
      fs.unlinkSync(req.file.path);
      console.log('Cleaned up uploaded file after error');
    } catch (unlinkError) {
      console.error('Error cleaning up file:', unlinkError);
    }
  }
  
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
});
