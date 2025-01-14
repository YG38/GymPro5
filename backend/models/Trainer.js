import { Schema, model } from 'mongoose';

const trainerSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    gymId: { type: Schema.Types.ObjectId, ref: 'Gym' },
});

const Trainer = model('Trainer', trainerSchema);

export default Trainer;
