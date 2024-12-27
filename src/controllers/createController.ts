import ToDo from '@/models/todoList';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose, { Types } from 'mongoose';

// Create ToDo item
export const createToDo = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { title, description, dueDate, priority , isCompleted } = req.body;
  const userIdString: string | undefined = req.userId; 

  if (!userIdString) {
    return res.status(400).json({ message: 'User ID is missing' });
  }

  try {
    const userId: Types.ObjectId = new mongoose.Types.ObjectId(userIdString); 

    const newToDo = new ToDo({
      title,
      description,
      dueDate,
      priority,
      isCompleted,
      userId, 
    
    });

    await newToDo.save();
    return res.status(201).json({ message: 'To-Do created successfully', toDo: newToDo });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(500).json({ message: 'Error creating to-do', error: errorMessage });
  }
};
