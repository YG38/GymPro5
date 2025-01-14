import { Schema, model } from 'mongoose';

const gymSchema = new Schema({
    gymName: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
});

const Gym = model('Gym', gymSchema);

export default Gym;
