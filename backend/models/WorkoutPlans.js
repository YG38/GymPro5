import mongoose from 'mongoose';

// Define the schema for the workout plans
const workoutPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Name is required for each workout plan
        trim: true, // Remove any extra spaces from the beginning and end of the string
    },
    description: {
        type: String,
        required: true, // Description is required for each workout plan
        trim: true, // Remove any extra spaces from the beginning and end of the string
    },
    duration: {
        type: Number,
        required: true, // Duration in weeks
    },
    category: {
        type: String,
        required: true, // Category is now required for each workout plan
        enum: ["Cardio", "Strength", "Flexibility", "HIIT", "Yoga", "Pilates"], // You can modify this list of categories as per your needs
    },
    exercises: [
        {
            name: {
                type: String,
                required: true, // Name of the exercise
            },
            sets: {
                type: Number,
                required: true, // Number of sets for the exercise
            },
            reps: {
                type: Number,
                required: true, // Number of reps per set
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the date when the workout plan is created
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Automatically set the date when the workout plan is updated
    },
});

// Create a model from the schema
const WorkoutPlans = mongoose.model('WorkoutPlans', workoutPlanSchema);

// Export the model to be used in other files
export default WorkoutPlans;
