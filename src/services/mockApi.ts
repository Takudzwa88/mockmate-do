import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoApiResponse } from '@/types/todo';

// Mock data
const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Complete React To-Do App',
    description: 'Build a comprehensive to-do application with TypeScript, proper state management, and mock API integration.',
    completed: false,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
  },
  {
    id: '2',
    title: 'Review Component Architecture',
    description: 'Ensure all components are properly structured, reusable, and follow React best practices.',
    completed: true,
    createdAt: new Date('2024-01-14T14:30:00Z'),
    updatedAt: new Date('2024-01-15T09:15:00Z'),
  },
  {
    id: '3',
    title: 'Implement Error Handling',
    description: 'Add comprehensive error handling with user-friendly messages and proper loading states.',
    completed: false,
    createdAt: new Date('2024-01-13T16:45:00Z'),
    updatedAt: new Date('2024-01-13T16:45:00Z'),
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random API failures (10% chance)
const shouldFail = () => Math.random() < 0.1;

class MockApiService {
  private todos: Todo[] = [...mockTodos];
  private nextId = 4;

  async getTodos(): Promise<TodoApiResponse> {
    await delay(800); // Simulate network delay

    if (shouldFail()) {
      throw new ApiError('Failed to fetch todos. Please try again.');
    }

    return {
      success: true,
      data: [...this.todos],
    };
  }

  async createTodo(request: CreateTodoRequest): Promise<TodoApiResponse> {
    await delay(600);

    if (shouldFail()) {
      throw new ApiError('Failed to create todo. Please try again.');
    }

    if (!request.title.trim()) {
      throw new ApiError('Title is required.');
    }

    const newTodo: Todo = {
      id: this.nextId.toString(),
      title: request.title.trim(),
      description: request.description.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.todos.unshift(newTodo);
    this.nextId++;

    return {
      success: true,
      data: newTodo,
    };
  }

  async updateTodo(request: UpdateTodoRequest): Promise<TodoApiResponse> {
    await delay(500);

    if (shouldFail()) {
      throw new ApiError('Failed to update todo. Please try again.');
    }

    const todoIndex = this.todos.findIndex(todo => todo.id === request.id);
    
    if (todoIndex === -1) {
      throw new ApiError('Todo not found.');
    }

    if (request.title !== undefined && !request.title.trim()) {
      throw new ApiError('Title cannot be empty.');
    }

    const updatedTodo: Todo = {
      ...this.todos[todoIndex],
      ...request,
      title: request.title?.trim() || this.todos[todoIndex].title,
      description: request.description?.trim() || this.todos[todoIndex].description,
      updatedAt: new Date(),
    };

    this.todos[todoIndex] = updatedTodo;

    return {
      success: true,
      data: updatedTodo,
    };
  }

  async deleteTodo(id: string): Promise<TodoApiResponse> {
    await delay(400);

    if (shouldFail()) {
      throw new ApiError('Failed to delete todo. Please try again.');
    }

    const todoIndex = this.todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      throw new ApiError('Todo not found.');
    }

    this.todos.splice(todoIndex, 1);

    return {
      success: true,
    };
  }
}

export class ApiError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const mockApiService = new MockApiService();