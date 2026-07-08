import mongoose from 'mongoose';

const checkInSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  checkedIn: { type: Boolean, default: false },
  time: { type: String }
}, { timestamps: true });

export default mongoose.model('CheckIn', checkInSchema);
