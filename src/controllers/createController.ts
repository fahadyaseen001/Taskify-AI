

import ToDo from '@/models/todoList';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { NotificationService } from '@/services/notificationService';

interface CreateToDoBody {
  title: string;
  description?: string;
  status: string;
  dueDate?: string;
  dueTime?: string;
  priority: string;
  assignee: {
    userId: string;
    name: string;
    email: string;
  };
  createdBy: {
    userId: string;
    name: string;
    email: string;
  };
}

export const createToDo = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { 
    title, 
    description, 
    dueDate, 
    dueTime, 
    priority, 
    status, 
    assignee,
    createdBy 
  } = req.body as CreateToDoBody;

  // Validate creator information from request body
  if (!createdBy?.userId || !createdBy?.name || !createdBy?.email) {
    return res.status(400).json({ message: 'Creator information is missing' });
  }

  // Validate assignee information
  if (!assignee?.userId || !assignee?.name || !assignee?.email) {
    return res.status(400).json({ message: 'Assignee information is required' });
  }

  try {
    const creatorId = new mongoose.Types.ObjectId(createdBy.userId);
    const assigneeId = new mongoose.Types.ObjectId(assignee.userId);

    const newToDo = new ToDo({
      title,
      description,
      dueDate,
      dueTime,
      priority,
      status,
      createdBy: {
        userId: creatorId,
        name: createdBy.name,
        email: createdBy.email
      },
      assignee: {
        userId: assigneeId,
        name: assignee.name,
        email: assignee.email
      }
    });

    await newToDo.save();

    // Send notification to assignee
    await NotificationService.notifyTaskAssignment(
      assignee.email,
      assignee.name,
      createdBy.name,
      newToDo._id.toString()
    );

    return res.status(201).json({ message: 'To-Do created successfully', toDo: newToDo });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(500).json({ message: 'Error creating to-do', error: errorMessage });
  }
};