import mongoose, { Document, Schema } from 'mongoose';

// Defining the ToDo schema with additional fields (dueDate, priority, etc.)
const ToDoSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,  // Title is required for a To-Do item
  },
  description: {
    type: String,
    required: false,  // Optional description of the To-Do item
  },
  isCompleted: {
    type: Boolean,
    default: false,  // Default to false for not completed
  },
  dueDate: {
    type: Date,
    required: false,  // Optional due date for the task
  },
  priority: {
    type: Number,
    default: 3,  // Default priority set to Low
    enum: [1, 2, 3,4,5,6,7,8,9,10],  // Priority can be 1-10
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // References the User model to associate each To-Do with a specific user
    required: true,  // Each To-Do needs a user association
  },
}, {
  timestamps: true,  // Automatically includes createdAt and updatedAt fields
});

// TypeScript interface for ToDo document
export interface ToDoType extends Document {
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: Date;
  priority: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Create and export the ToDo model using Mongoose
const ToDo = mongoose.models.ToDo || mongoose.model<ToDoType>('ToDo', ToDoSchema);

export default ToDo;
