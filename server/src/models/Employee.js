import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
