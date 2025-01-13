// models/pendingUser.ts
import mongoose from 'mongoose';

const pendingUserSchema = new mongoose.Schema({
  name: {
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
  verificationToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 24 * 60 * 60, // Auto-delete after 24 hours
  },
});

export default mongoose.models.PendingUser || mongoose.model('PendingUser', pendingUserSchema);
