'use server'


import ToDo from '@/models/todoList';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

// Delete ToDo item
export const deleteToDo = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { id } = req.query;
  const userIdString: string | undefined = req.userId;

  if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ message: 'Invalid ToDo ID' });
  }

  if (!userIdString) {
    return res.status(400).json({ message: 'User ID is missing' });
  }

  try {

    // Check if the ToDo belongs to the user
    const toDo = await ToDo.findOne({ _id: id, "createdBy.userId": userIdString });


    if (!toDo) {
      return res.status(404).json({ message: 'To-Do not found' });
    }

    // Delete the ToDo item
    await ToDo.deleteOne({ _id: id });
    return res.status(200).json({ message: 'To-Do deleted successfully' });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(500).json({ message: 'Error deleting to-do', error: errorMessage });
  }
};
