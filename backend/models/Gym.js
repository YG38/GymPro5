import mongoose from 'mongoose';

// Define Gym schema
const GymSchema = new mongoose.Schema({
  gymName: {
    type: String,
    required: [true, 'Gym name is required'],
    trim: true,
    minlength: [2, 'Gym name must be at least 2 characters long'],
    maxlength: [50, 'Gym name cannot exceed 50 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    minlength: [5, 'Location must be at least 5 characters long'],
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(v) {
        return !isNaN(v) && v >= 0;
      },
      message: props => `${props.value} is not a valid price!`
    }
  },
  managerName: {
    type: String,
    required: [true, 'Manager name is required'],
    trim: true,
    minlength: [2, 'Manager name must be at least 2 characters long'],
    maxlength: [50, 'Manager name cannot exceed 50 characters']
  },
  managerEmail: {
    type: String,
    required: [true, 'Manager email is required'],
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  managerPassword: {
    type: String,
    required: [true, 'Manager password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  logo: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: {
    transform: function(doc, ret) {
      delete ret.managerPassword; // Remove password when converting to JSON
      return ret;
    }
  }
});

// Add index for faster lookups
GymSchema.index({ gymName: 1 }, { unique: true });
GymSchema.index({ managerEmail: 1 }, { unique: true });

const Gym = mongoose.model('Gym', GymSchema);
export default Gym;
