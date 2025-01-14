import { Schema, model } from 'mongoose';

const managerSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    gymId: { type: Schema.Types.ObjectId, ref: 'Gym' },
});

const Manager = model('Manager', managerSchema);

export default Manager;
