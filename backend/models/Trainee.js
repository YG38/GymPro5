import mongoose from 'mongoose';

const traineeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gymId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym',
    required: true,
  },
  membershipDuration: {
    type: String,
    enum: ['1 month', '3 months', '6 months', '1 year'],
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
});

const Trainee = mongoose.model('Trainee', traineeSchema);

export default Trainee;
