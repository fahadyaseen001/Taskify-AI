import OpenAI from 'openai';
import { ToDoType } from '@/models/todoList';
import ToDo from '@/models/todoList';
import mongoose from 'mongoose';
import { createTaskIdMap } from '@/utils/ai/taskIdMap';

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";

const openai = new OpenAI({
  baseURL: endpoint,
  apiKey: token
});

interface ParsedCommand {
  action: 'create' | 'read' | 'update' | 'delete';
  data?: Partial<ToDoType>;
  filters?: Record<string, any>;
  todoId?: string;
}

interface UserInfo {
  userId: string;
  name: string;
  email: string;
}

export class AIAgentService {
  private static async parseCommand(input: string): Promise<ParsedCommand> {
    const systemPrompt = `You are a TODO management assistant. Parse the user's natural language input into a structured command for task creation and management.
    Parse the command into the following format matching our data model:
    
    For creation/updates:
    - title: string
    - description: string
    - status: "Completed" | "Cancelled" | "Todo" | "In Progress" | "BackLog"
    - dueDate: ISO string
    - dueTime: string in "HH:MM AM/PM" format
    - priority: "High" | "Medium" | "Low"
    
    The response should include:
    - action: "create" | "read" | "update" | "delete"
    - data: the task data (for create/update)
    - todoId: string (for update/delete)
    - filters: for read operations`;
  
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input }
      ],
      model: modelName,
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 1000
    });
  
    let content = completion.choices[0].message.content || '{}';
  
    // Log the content for inspection
    console.log('AI Response Content:', content);
  
    // Remove any unwanted characters
    content = content.replace(/```json/g, '').replace(/```/g, '');
  
    try { const command = JSON.parse(content) as ParsedCommand; 
     const taskIdMap = await createTaskIdMap(); 
     if (command.todoId) { 
      const formattedId = `TASK-${command.todoId.slice(-4)}`;
       const fullId = taskIdMap[formattedId]; 
       if (fullId) { 
        command.todoId = fullId;
       } else { throw new Error('Invalid Task ID'); }
      } return command;
     } catch (error) { console.error('Failed to parse JSON:', error); throw new Error('Invalid JSON response from AI'); } }
  

  public static async processCommand(
    input: string,
    userId: string,
    userName: string,
    userEmail: string
  ) {
    const command = await this.parseCommand(input);
    const userInfo = { userId, name: userName, email: userEmail };

    switch (command.action) {
      case 'create':
        if (!command.data) throw new Error('Data is required for create action');
        return await this.createTask(command.data, userInfo);
      case 'update':
        if (!command.data) throw new Error('Data is required for update action');
        return await this.updateTask(command.todoId!, command.data);
      case 'delete':
        return await this.deleteTask(command.todoId!);
      case 'read':
        return await this.readTasks(command.filters, userId);
      default:
        throw new Error('Invalid command action');
    }
  }

  private static async createTask(data: Partial<ToDoType>, userInfo: UserInfo) {
    try {
      const taskData = {
        ...data,
        createdBy: userInfo,
        assignee: data.assignee || userInfo // Default assignee to creator if not specified
      };

      const newTask = new ToDo(taskData);
      await newTask.save();
      return { success: true, task: newTask };
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  }

  private static async updateTask(todoId: string, data: Partial<ToDoType>) {
    try {
      if (!mongoose.Types.ObjectId.isValid(todoId)) {
        throw new Error('Invalid task ID');
      }

      const updatedTask = await ToDo.findByIdAndUpdate(
        todoId,
        { $set: data },
        { new: true }
      );

      if (!updatedTask) {
        throw new Error('Task not found');
      }

      return { success: true, task: updatedTask };
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  }

  private static async deleteTask(todoId: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(todoId)) {
        throw new Error('Invalid task ID');
      }

      const deletedTask = await ToDo.findByIdAndDelete(todoId);
      
      if (!deletedTask) {
        throw new Error('Task not found');
      }

      return { success: true, message: 'Task deleted successfully' };
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  }

  private static async readTasks(filters: Record<string, any> = {}, userId: string) {
    try {
      // Ensure user can only access tasks they're involved with
      const userFilter = {
        $or: [
          { 'createdBy.userId': userId },
          { 'assignee.userId': userId }
        ]
      };

      const query = { ...filters, ...userFilter };
      const tasks = await ToDo.find(query);
      return { success: true, tasks };
    } catch (error) {
      console.error('Error reading tasks:', error);
      throw new Error('Failed to read tasks');
    }
  }
}
