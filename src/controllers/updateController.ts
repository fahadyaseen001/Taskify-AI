import ToDo from '@/models/todoList';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

interface UpdateToDoBody {
  title?: string;
  description?: string;
  status?: string;
  dueDate?: string;
  dueTime?: string;
  priority?: string;
  assignee?: {
    userId: string;
    name: string;
    email: string;
  };
}

export const updateToDo = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { 
    title, 
    description, 
    dueDate, 
    dueTime, 
    priority, 
    status,
    assignee 
  } = req.body as UpdateToDoBody;
  
  const { id } = req.query;

  if (!id || !mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid To-Do ID' });
  }

  try {
    const todoToUpdate = await ToDo.findById(id);

    if (!todoToUpdate) {
      return res.status(404).json({ message: 'To-Do not found' });
    }

    // Update basic fields if provided
    if (title) todoToUpdate.title = title;
    if (description !== undefined) todoToUpdate.description = description;
    if (dueDate !== undefined) todoToUpdate.dueDate = dueDate;
    if (dueTime !== undefined) todoToUpdate.dueTime = dueTime;
    if (priority) todoToUpdate.priority = priority;
    if (status) todoToUpdate.status = status;

    // Update assignee if provided
    if (assignee) {
      if (!assignee.userId || !assignee.name || !assignee.email) {
        return res.status(400).json({ message: 'Incomplete assignee information provided' });
      }

      const assigneeId = new mongoose.Types.ObjectId(assignee.userId);
      todoToUpdate.assignee = {
        userId: assigneeId,
        name: assignee.name,
        email: assignee.email
      };
    }

    // Save the updated To-Do item
    await todoToUpdate.save();
    return res.status(200).json({ message: 'To-Do updated successfully', toDo: todoToUpdate });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(500).json({ message: 'Error updating to-do', error: errorMessage });
  }
};