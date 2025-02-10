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
  manager: {
    type: String,
    required: true
  }
});

const Gym = mongoose.model('Gym', gymSchema);

// Named export
export { Gym };
