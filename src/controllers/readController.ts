import ToDo from '@/models/todoList';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose, { Types } from 'mongoose';

// Read all ToDo items for the authenticated user
export const getAllToDos = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const userIdString: string | undefined = req.userId; // Retrieve user ID from JWT token
  
  if (!userIdString) {
    return res.status(400).json({ message: 'User ID is missing' }); // Return error if user ID is not found
  }

  try {
    const userId: Types.ObjectId = new mongoose.Types.ObjectId(userIdString); // Convert userId to ObjectId
    
    // Fetch To-Do items for the authenticated user
    const toDoItems = await ToDo.find({ userId }).sort({ createdAt: -1 }); // Sort in descending order of creation date
    
    // If there are no to-do items, return an empty list
    if (toDoItems.length === 0) {
      return res.status(200).json({ message: 'No to-do items found for the user', toDoItems: [] });
    }
    
    // Return the fetched to-do items
    return res.status(200).json({ message: 'To-Do items fetched successfully', toDoItems });
  } catch (error) {
    const errorMessage = (error as Error).message; // Catch database-related errors
    return res.status(500).json({ message: 'Error fetching to-do items', error: errorMessage });
  }
};
