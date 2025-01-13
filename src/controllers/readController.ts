import ToDo from '@/models/todoList';
import { NextApiRequest, NextApiResponse } from 'next';

export const getAllToDos = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const userIdString: string | undefined = req.userId;
  
  if (!userIdString) {
    return res.status(400).json({ message: 'User ID is missing' });
  }

  try {
    const toDoItems = await ToDo.find({ "createdBy.userId": userIdString }).sort({ createdAt: -1 });

    
    if (toDoItems.length === 0) {
      return res.status(200).json({ message: 'No to-do items found for the user', toDoItems: [] });
    }
    
    return res.status(200).json({ message: 'To-Do items fetched successfully', toDoItems });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(500).json({ message: 'Error fetching to-do items', error: errorMessage });
  }
};
