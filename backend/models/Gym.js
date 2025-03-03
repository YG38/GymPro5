import mongoose from 'mongoose';

const GymSchema = new mongoose.Schema({
  gymName: {
    type: String,
    required: [true, 'Gym name is required'],
    trim: true,
    unique: true, // Single unique declaration
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
    min: [0, 'Price cannot be negative']
  },
  manager: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WebUser',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Manager name is required']
    },
    email: {
      type: String,
      required: [true, 'Manager email is required'],
      unique: true, // Single unique declaration
      lowercase: true,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: props => `${props.value} is not a valid email address!`
      }
    }
  },
  logo: {
    data: String,
    contentType: String
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      return ret;
    }
  }
});

// Remove manual index declarations - field-level "unique: true" is sufficient
const Gym = mongoose.models.Gym || mongoose.model('Gym', GymSchema);
export default Gym;