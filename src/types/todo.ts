export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoRequest {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UpdateTodoRequest {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface TodoApiResponse {
  success: boolean;
  data?: Todo | Todo[];
  error?: string;
}