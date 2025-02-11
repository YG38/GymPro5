import mongoose from 'mongoose';

const gymSchema = new mongoose.Schema({
  gymName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  logo: {
    type: String, // Store the image as a URL
    required: true
  },
  manager: {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  }
});

const Gym = mongoose.model('Gym', gymSchema);

// Default export
export default Gym;