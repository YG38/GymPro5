import express from 'express';
import mongoose from 'mongoose'; // Default import for mongoose
import bodyParser from 'body-parser';
import WorkoutPlans from './models/workoutPlans.js';

const { connect, connection } = mongoose; // Extract 'connect' and 'connection'

const app = express();

// MongoDB connection string
const dbURI = 'mongodb+srv://ymebratu64:MongodbYoni1@gympro5.rqviz.mongodb.net/gympro5?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB Atlas!');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB Atlas:', err);
    });

// Routes for workout plans

// Get all workout plans
app.get('/api/workoutplans', async (req, res) => {
    try {
        const workoutPlans = await WorkoutPlans.find();
        res.json(workoutPlans);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
