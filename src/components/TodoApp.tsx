import { useState, useEffect, useMemo } from 'react';
import { CheckSquare, ListTodo } from 'lucide-react';
import { Todo } from '@/types/todo';
import { mockApiService, ApiError } from '@/services/mockApi';
import { AddTodoForm } from './AddTodoForm';
import { TodoItem } from './TodoItem';
import { EditTodoModal } from './EditTodoModal';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorMessage } from './ErrorMessage';
import { SearchAndSort } from './SearchAndSort';
import { useToast } from '@/hooks/use-toast';

interface LoadingStates {
  fetching: boolean;
  creating: boolean;
  updating: string | null;
  deleting: string | null;
  editingModal: boolean;
}

export const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState<LoadingStates>({
    fetching: true,
    creating: false,
    updating: null,
    deleting: null,
    editingModal: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { toast } = useToast();

  // Filter and sort todos
  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos;

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = todos.filter(todo =>
        todo.title.toLowerCase().includes(search) ||
        todo.description.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'alphabetical-desc':
          return b.title.localeCompare(a.title);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'priority-desc':
          const priorityOrderDesc = { high: 1, medium: 2, low: 3 };
          return priorityOrderDesc[a.priority] - priorityOrderDesc[b.priority];
        case 'completed':
          return (b.completed ? 1 : 0) - (a.completed ? 1 : 0);
        case 'incomplete':
          return (a.completed ? 1 : 0) - (b.completed ? 1 : 0);
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'newest':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return sorted;
  }, [todos, searchTerm, sortBy]);

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setError(null);
      setLoading(prev => ({ ...prev, fetching: true }));
      const response = await mockApiService.getTodos();
      setTodos(response.data as Todo[]);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to load todos';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, fetching: false }));
    }
  };

  const handleAddTodo = async (title: string, description: string, priority: 'low' | 'medium' | 'high') => {
    try {
      setError(null);
      setLoading(prev => ({ ...prev, creating: true }));
      const response = await mockApiService.createTodo({ title, description, priority });
      const newTodo = response.data as Todo;
      setTodos(prev => [newTodo, ...prev]);
      toast({
        title: 'Success',
        description: 'Todo created successfully!',
      });
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to create todo';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err; // Re-throw to prevent form reset
    } finally {
      setLoading(prev => ({ ...prev, creating: false }));
    }
  };

  const handleToggleComplete = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      setError(null);
      setLoading(prev => ({ ...prev, updating: id }));
      const response = await mockApiService.updateTodo({
        id,
        completed: !todo.completed,
      });
      const updatedTodo = response.data as Todo;
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
      toast({
        title: 'Success',
        description: `Todo marked as ${updatedTodo.completed ? 'completed' : 'incomplete'}!`,
      });
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to update todo';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, updating: null }));
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleSaveEdit = async (id: string, title: string, description: string, priority: 'low' | 'medium' | 'high') => {
    try {
      setError(null);
      setLoading(prev => ({ ...prev, editingModal: true }));
      const response = await mockApiService.updateTodo({
        id,
        title,
        description,
        priority,
      });
      const updatedTodo = response.data as Todo;
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
      setEditingTodo(null);
      toast({
        title: 'Success',
        description: 'Todo updated successfully!',
      });
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to update todo';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err; // Re-throw to prevent modal close
    } finally {
      setLoading(prev => ({ ...prev, editingModal: false }));
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      setError(null);
      setLoading(prev => ({ ...prev, deleting: id }));
      await mockApiService.deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
      toast({
        title: 'Success',
        description: 'Todo deleted successfully!',
      });
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to delete todo';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, deleting: null }));
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-soft">
              <CheckSquare className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              My Todos
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay organized and productive with your personal todo manager. 
            Create, edit, and track your tasks with ease.
          </p>
          {totalCount > 0 && (
            <div className="flex items-center justify-center space-x-4 mt-6 text-sm">
              <div className="flex items-center space-x-2 px-3 py-1 bg-card rounded-full border border-border">
                <ListTodo className="h-4 w-4 text-primary" />
                <span className="font-medium">{totalCount} total</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-success-light rounded-full border border-success/20">
                <CheckSquare className="h-4 w-4 text-success" />
                <span className="font-medium text-success">{completedCount} completed</span>
              </div>
            </div>
          )}
        </header>

        {/* Add Todo Form */}
        <div className="mb-8">
          <AddTodoForm
            onAddTodo={handleAddTodo}
            isLoading={loading.creating}
          />
        </div>

        {/* Search and Sort */}
        <SearchAndSort
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error}
            onDismiss={() => setError(null)}
            className="mb-6"
          />
        )}

        {/* Todo List */}
        <div className="space-y-4">
          {loading.fetching ? (
            <LoadingSkeleton count={3} />
          ) : filteredAndSortedTodos.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-muted/50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <ListTodo className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                {searchTerm ? 'No todos found' : 'No todos yet'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchTerm 
                  ? `No todos match "${searchTerm}". Try a different search term.`
                  : 'Get started by adding your first todo above. Stay organized and productive!'
                }
              </p>
            </div>
          ) : (
            filteredAndSortedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTodo}
                onDelete={handleDeleteTodo}
                isUpdating={loading.updating === todo.id}
                isDeleting={loading.deleting === todo.id}
              />
            ))
          )}
        </div>

        {/* Edit Modal */}
        <EditTodoModal
          todo={editingTodo}
          isOpen={!!editingTodo}
          isLoading={loading.editingModal}
          onClose={() => setEditingTodo(null)}
          onSave={handleSaveEdit}
        />
      </div>
    </div>
  );
};