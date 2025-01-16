import OpenAI from 'openai';
import { ToDoType } from '@/models/todoList';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface ParsedCommand {
  action: 'create' | 'read' | 'update' | 'delete';
  data?: Partial<ToDoType>;
  filters?: Record<string, any>;
  todoId?: string;
}

export class AIAgentService {
  private static async parseCommand(input: string): Promise<ParsedCommand> {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a TODO management assistant. Parse the user's natural language input into a structured command. 
          Extract relevant information like action type (CRUD), title, description, status, priority, due date, etc.
          Respond only with a JSON object.`
        },
        {
          role: "user",
          content: input
        }
      ],
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content || '{}') as ParsedCommand;
  }

  static async processCommand(
    input: string,
    userId: string,
    userName: string,
    userEmail: string
  ) {
    const command = await this.parseCommand(input);
    
    const userInfo = {
      userId,
      name: userName,
      email: userEmail
    };

    // Prepare the request body based on the command
    const body = command.data ? {
      ...command.data,
      createdBy: userInfo,
      assignee: userInfo // Default assignee to the same user
    } : {};

    // Construct API request options
    const requestOptions = {
      method: this.getMethodForAction(command.action),
      headers: {
        'Content-Type': 'application/json',
      },
      body: Object.keys(body).length ? JSON.stringify(body) : undefined
    };

    // Determine the endpoint based on the action
    const endpoint = this.getEndpointForAction(command.action, command.todoId);

    const response = await fetch(endpoint, requestOptions);
    return response.json();
  }

  private static getMethodForAction(action: string): string {
    const methodMap = {
      create: 'POST',
      read: 'GET',
      update: 'PUT',
      delete: 'DELETE'
    } as const;
    return methodMap[action as keyof typeof methodMap] || 'GET';
  }

  private static getEndpointForAction(action: string, todoId?: string): string {
    const baseUrl = '/api/toDo';
    if (action === 'create') return baseUrl + '/create';
    if (action === 'read') return baseUrl + '/read';
    if (action === 'update' && todoId) return `${baseUrl}/update?id=${todoId}`;
    if (action === 'delete' && todoId) return `${baseUrl}/delete?id=${todoId}`;
    return baseUrl + '/read'; // Default to read
  }
} 