import mongoose, { Document, Schema } from 'mongoose';

interface UserInfo {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
}

const UserInfoSchema = new Schema<UserInfo>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: { type: String, required: true },
  email: { type: String, required: true }
});

const ToDoSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['Completed', 'Cancelled', 'Todo', 'In Progress', 'BackLog'],
    default: 'Todo',
  },
  dueDate: {
    type: String,
    required: false,
  },
  dueTime: {
    type: String,
    required: false,
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Low',
  },
  createdBy: {
    type: UserInfoSchema,
    required: true
  },
  assignee: {
    type: UserInfoSchema,
    required: true
  }
}, {
  timestamps: true,
});

export interface ToDoType extends Document {
  title: string;
  description?: string;
  status: 'Completed' | 'Cancelled' | 'Todo' | 'In Progress' | 'BackLog';
  dueDate?: string;
  dueTime?: string;
  priority: 'High' | 'Medium' | 'Low';
  createdBy: UserInfo;
  assignee: UserInfo;
  createdAt: Date;
  updatedAt: Date;
}

const ToDo = mongoose.models.ToDo || mongoose.model<ToDoType>('ToDo', ToDoSchema);
export default ToDo;
