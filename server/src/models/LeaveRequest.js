import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  reason: { type: String, default: 'No reason provided' },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('LeaveRequest', leaveRequestSchema);
