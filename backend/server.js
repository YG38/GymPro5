import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js'; // Android app authentication
import authWebRoutes from './routes/auth-web.js'; // Web app authentication
import gymRoutes from './routes/gym.js'; // Gym routes

// Initialize express app
const app = express();

// Load environment variables
dotenv.config();

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

// Log request details for debugging
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log('Request Body:', req.body);
  next();
});

// Debugging MongoDB Connection
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in .env file!");
  process.exit(1);
} else {
  console.log('✅ MONGODB_URI loaded successfully');
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('\u2705 Connected to MongoDB')) // Unicode for ✅
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

// 🏋️ Gym Routes (For AddGymForm)
app.use('/api/gym', gymRoutes);

// Global Error Handling
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
});
