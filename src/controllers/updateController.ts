// controllers/updateController.ts
import ToDo from '@/models/todoList';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose, { Types } from 'mongoose';

// Update ToDo item
export const updateToDo = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { title, description, dueDate, priority, isCompleted } = req.body;
  const { id } = req.query; // id of the To-Do from URL (req.query.id)
  const userIdString: string | undefined = req.userId;

  if (!userIdString) {
    return res.status(400).json({ message: 'User ID is missing' });
  }

  if (!id || !mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid To-Do ID' });
  }

  try {
    const userId: Types.ObjectId = new mongoose.Types.ObjectId(userIdString);
    const todoToUpdate = await ToDo.findOne({ _id: id, userId }); // Only allow updating if user owns the ToDo

    if (!todoToUpdate) {
      return res.status(404).json({ message: 'To-Do not found or not authorized to update' });
    }

    // Update the fields
    todoToUpdate.title = title || todoToUpdate.title;
    todoToUpdate.description = description || todoToUpdate.description;
    todoToUpdate.dueDate = dueDate || todoToUpdate.dueDate;
    todoToUpdate.priority = priority || todoToUpdate.priority;
    todoToUpdate.isCompleted = isCompleted !== undefined ? isCompleted : todoToUpdate.isCompleted;

    // Save the updated To-Do item
    await todoToUpdate.save();
    return res.status(200).json({ message: 'To-Do updated successfully', toDo: todoToUpdate });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(500).json({ message: 'Error updating to-do', error: errorMessage });
  }
};
