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

interface RequiredTaskFields {
  title: boolean;
  description: boolean;
  priority: boolean;
  status: boolean;
  dueDate: boolean;
  dueTime: boolean;
  assignee: boolean;
}

export class AIAgentService {
  private static readonly ACTION_KEYWORDS = {
    read: ['show', 'give', 'tell', 'display', 'list', 'find', 'search', 'get'],
    create: ['add', 'make', 'create', 'new'],
    update: ['update', 'edit', 'modify', 'change', 'set'],
    delete: ['delete', 'remove']
  };


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
       - Extract specific search criteria including: (if mentioned)
       - Task ID (if mentioned)
       - Title keywords
       - Description keywords
       - Status (exact match)
       - Priority level
       - Assignee name
       - Due date
       - Due time
    
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
        return await this.readTasks(command.filters, command.todoIds || [], userInfo.userId // Pass user ID
        );
      default:
        throw new Error('Invalid command action');
    }
  }

  private static validateTaskFields(data: Partial<ToDoType>): { isValid: boolean; missingFields: string[] } {
    const requiredFields: RequiredTaskFields = {
      title: true,
      description: true,
      priority: true,
      status: true,
      dueDate: true,
      dueTime: true,
      assignee: true
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([field, required]) => required && !data[field as keyof ToDoType])
      .map(([field]) => field);

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }

  private static async createTask(data: Partial<ToDoType>, userInfo: UserInfo) {
    try {
      // Validate required fields
      const validation = this.validateTaskFields(data);
      if (!validation.isValid) {
        throw new Error(
          `Cannot create task. Missing required fields: ${validation.missingFields.join(', ')}. ` +
          'Please provide all required fields to create a task.'
        );
      }

      const taskData = {
        ...data,
        createdBy: userInfo,
        assignee: data.assignee || userInfo
      };

      const newTask = new ToDo(taskData);
      await newTask.save();
      return { success: true, task: newTask };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error; // Throw the original error to preserve the missing fields message
    }
  }

  private static async updateTask(todoId: string, data: Partial<ToDoType> ) {
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

  private static async readTasks(filters: Record<string, any> = {}, todoIds: string[] = [],  userId: mongoose.Types.ObjectId // Add userId parameter
  ) {
    try {
      let query: any = { 'createdBy.userId': userId};
      
      // Process filters
      if (filters) {
        // Handle text search fields
        if (filters.title) {
          query.title = { $regex: filters.title, $options: 'i' };
        }
        if (filters.description) {
          query.description = { $regex: filters.description, $options: 'i' };
        }
        
        // Handle exact match fields
        if (filters.status) {
          query.status = filters.status;
        }
        if (filters.priority) {
          query.priority = filters.priority;
        }
        
        // Handle date/time
        if (filters.dueDate) {
          query.dueDate = filters.dueDate;
        }
        if (filters.dueTime) {
          query.dueTime = filters.dueTime;
        }
        
        // Handle assignee name search
        if (filters.assigneeName) {
          const user = await this.findUserByName(filters.assigneeName);
          if (user) {
            query['assignee.userId'] = user._id;
          }
        }
      }
      
      // Add specific task IDs to query if provided
      if (todoIds.length > 0) {
        query._id = { $in: todoIds };
      }
  

      const tasks = await ToDo.find(query).lean();
      
      
      return {
        success: true,
        tasks,
        filters: filters // Return filters for frontend state management
      };
    } catch (error) {
      console.error('Error reading tasks:', error);
      throw new Error('Failed to read tasks');
    }
  }
}

