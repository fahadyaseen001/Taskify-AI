import mongoose, { Document, Schema } from 'mongoose';

// Defining the ToDo schema with additional fields (dueDate, priority, etc.)
const ToDoSchema: Schema = new Schema({
  title: {
    type: String,
    required: true, // Title is required for a To-Do item
  },
  description: {
    type: String,
    required: false, // Optional description of the To-Do item
  },
  status: {
    type: String,
    enum: ['Completed', 'Cancelled', 'Todo', 'In Progress', 'BackLog'], // Status options
    default: 'Todo', // Default to 'Todo'
  },
  dueDate: {
    type: String,
    required: false, // Optional due date for the task
  },
  dueTime:{
    type: String,
    required: false, // Optional due date for the task
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'], // Priority options
    default: 'Low', // Default priority set to 'Low'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User model to associate each To-Do with a specific user
    required: true, // Each To-Do needs a user association
  },
}, {
  timestamps: true, // Automatically includes createdAt and updatedAt fields
});

// TypeScript interface for ToDo document
export interface ToDoType extends Document {
  title: string;
  description?: string;
  status: 'Completed' | 'Cancelled' | 'Todo' | 'In Progress' | 'BackLog';
  dueDate?: string;
  dueTime?: string;
  priority: 'High' | 'Medium' | 'Low';
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Create and export the ToDo model using Mongoose
const ToDo = mongoose.models.ToDo || mongoose.model<ToDoType>('ToDo', ToDoSchema);

export default ToDo;
