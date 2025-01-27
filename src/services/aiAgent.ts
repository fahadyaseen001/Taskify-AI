import OpenAI from 'openai';
import { ToDoType } from '@/models/todoList';
import ToDo from '@/models/todoList';
import mongoose from 'mongoose';
import { createTaskIdMap } from '@/utils/ai/taskIdMap';
import { UserInfo } from '@/models/user';

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";

const openai = new OpenAI({
  baseURL: endpoint,
  apiKey: token
});

interface User {
  _id: string;
  name: string;
  email: string;
}

interface ParsedCommand {
  action: 'create' | 'read' | 'update' | 'delete';
  data?: Partial<ToDoType>[];
  filters?: {
    status?: string;
    priority?: string;
    assigneeName?: string;
    title?: string;
    description?: string;
    dueDate?: string;
    dueTime?: string;
  };
  todoIds?: string[];
  taskCount?: number;
}

export class AIAgentService {
  private static readonly ACTION_KEYWORDS = {
    read: ['show', 'give', 'tell', 'display', 'list', 'find', 'search', 'get'],
    create: ['add', 'make', 'create', 'new'],
    update: ['update', 'edit', 'modify', 'change', 'set'],
    delete: ['delete', 'remove']
  };

  private static async fetchUsers(): Promise<User[]> {
    try {
      // Using Mongoose to fetch users from the User collection
      const User = mongoose.model('User');
      const users = await User.find({}, 'name email');
      return users.map(user => ({
        _id: user._id.toString(),
        name: user.name,
        email: user.email
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users from database');
    }
  }

  private static async findUserByName(name: string): Promise<User | undefined> {
    try {
      const User = mongoose.model('User');
      // Case-insensitive name search using MongoDB regex
      const user = await User.findOne({
        name: { 
          $regex: name,
          $options: 'i' // case-insensitive
        }
      });
      
      if (!user) return undefined;
      
      return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email
      };
    } catch (error) {
      console.error('Error finding user:', error);
      return undefined;
    }
  }

  private static async parseCommand(input: string): Promise<ParsedCommand> {
    const systemPrompt = `You are a TODO management assistant. Parse the user's natural language input into structured commands for task management.

    Action Keywords:
    - Read: ${AIAgentService.ACTION_KEYWORDS.read.join(', ')}
    - Create: ${AIAgentService.ACTION_KEYWORDS.create.join(', ')}
    - Update: ${AIAgentService.ACTION_KEYWORDS.update.join(', ')}
    - Delete: ${AIAgentService.ACTION_KEYWORDS.delete.join(', ')}

    Task Properties:
    - title: string
    - description: string
    - status: "Completed" | "Cancelled" | "Todo" | "In Progress" | "BackLog"
    - dueDate: ISO string
    - dueTime: string in "HH:MM AM/PM" format
    - priority: "High" | "Medium" | "Low"
    - assigneeName: string (just the name of the assignee)

    Special Requirements:
    1. Read Operations:
       - Can read all tasks with/without filters
       - Can read specific task(s) by Task ID
       - Handle non-filter searches
       
    2. Create Operations:
       - Support single/multiple task creation
       - Include filters
       
    3. Update Operations:
       - Requires Task ID(s)
       - Can update any field(s)
       
    4. Delete Operations:
       - Requires Task ID(s)
       - Support single/multiple deletion

    For assignee handling:
    - Extract just the name of the assignee from the command
    - Store it in the assigneeName field
    - The system will later match this name to a user in the database

    Response Format:
    {
      "action": "create" | "read" | "update" | "delete",
      "data": [{ task properties }],
      "filters": { filter properties with assigneeName },
      "todoIds": ["TASK-XXXX", ...],
      "taskCount": number
    }`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input }
      ],
      model: modelName,
      temperature: 0.7,
      max_tokens: 1000
    });

    let content = completion.choices[0].message.content || '{}';
    content = content.replace(/```json/g, '').replace(/```/g, '');

    try {
      const command = JSON.parse(content) as ParsedCommand;
      
      // Convert task IDs if present
      if (command.todoIds?.length) {
        const taskIdMap = await createTaskIdMap();
        command.todoIds = command.todoIds.map(shortId => {
          const formattedId = `TASK-${shortId.slice(-4)}`;
          const fullId = taskIdMap[formattedId];
          if (!fullId) throw new Error(`Invalid Task ID: ${formattedId}`);
          return fullId;
        });
      }

      return command;
    } catch (error) {
      console.error('Failed to parse command:', error);
      throw new Error('Invalid command format');
    }
  }

  private static async resolveAssignee(assigneeName: string): Promise<UserInfo> {
    const user = await this.findUserByName(assigneeName);
    if (!user) {
      throw new Error(`No user found matching name: ${assigneeName}`);
    }
    return {
      userId: new mongoose.Types.ObjectId(user._id),
      name: user.name,
      email: user.email
    };
  }

  private static async processTaskData(data: Partial<ToDoType>[], command: ParsedCommand): Promise<Partial<ToDoType>[]> {
    const processedData = await Promise.all(data.map(async (task) => {
      const processedTask = { ...task };
      
      // If assigneeName is in filters, use it for all tasks
      if (command.filters?.assigneeName) {
        processedTask.assignee = await this.resolveAssignee(command.filters.assigneeName);
      }
      // If individual task has assigneeName
      else if ('assigneeName' in task) {
        const assigneeName = task.assigneeName as string;
        processedTask.assignee = await this.resolveAssignee(assigneeName);
      }
      
      return processedTask;
    }));

    return processedData;
  }

  public static async processCommand(
    input: string,
    userId: mongoose.Types.ObjectId,
    userName: string,
    userEmail: string
  ) {
    const command = await this.parseCommand(input);
    const userInfo: UserInfo = { userId: new mongoose.Types.ObjectId(userId), name: userName, email: userEmail };

    // Process task data if present
    if (command.data) {
      command.data = await this.processTaskData(command.data, command);
    }

    switch (command.action) {
      case 'create':
        return await this.createTask(command.data?.[0] || {}, userInfo);
      case 'update':
        if (!command.todoIds?.length) throw new Error('Task ID is required for updates');
        return await this.updateTask(command.todoIds[0], command.data![0]);
      case 'delete':
        if (!command.todoIds?.length) throw new Error('Task ID is required for deletion');
        return await this.deleteTask(command.todoIds[0]);
      case 'read':
        if (!command.todoIds || command.todoIds.length === 0) throw new Error('Task ID is required for reading tasks');
        return await this.readTasks(command.filters, command.todoIds);
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

  private static async readTasks(filters: Record<string, any> = {}, todoIds: string[] = []) {
    try {
      // Ensure user can only access tasks they're involved with
      const userFilter = {
        $or: [
          { 'createdBy.userId': { $in: todoIds } },
          { 'assignee.userId': { $in: todoIds } }
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
