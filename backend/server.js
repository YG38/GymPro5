import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import gymRoutes from './routes/gym.js';
import authRoutes from './routes/auth.js'; // For Android app authentication
import authWebRoutes from './routes/auth-web.js'; // For React web authentication
import GymController from './controllers/GymController.js';
// Initialize express app
const app = express();

// Load environment variables
dotenv.config();

// CORS Configuration - Allow both local and production
const allowedOrigins = ["http://gym-pro5.vercel.app" ,"http://localhost:5173"];

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

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(error => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Welcome to GymPro5 API' });
});
// Health Check Endpoint (Add this above the root route)
app.get('/health-check', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});
// Separate authentication routes for Web & Android
app.use('/api/auth', authRoutes); // Android app authentication
app.use('/api/auth-web', authWebRoutes); // Web app authentication
app.use('/api', gymRoutes); // Use gym routes at '/api'

app.post('/api/gym', GymController.addGym);  // Using addGym method from GymController

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
