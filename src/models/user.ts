import mongoose, { Schema, model, models } from 'mongoose';

// User Type
export interface UserType {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
  }

// UserInfo Type
export interface UserInfo {
    userId: mongoose.Types.ObjectId; // Ensure this is consistent
    name: string;
    email: string;
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Will store hashed passwords
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

const User = models.User || model('User', UserSchema);

export default User;

