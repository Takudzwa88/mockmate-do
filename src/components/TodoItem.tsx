import { useState } from 'react';
import { Edit, Trash2, Check, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Todo } from '@/types/todo';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => Promise<void>;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => Promise<void>;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export const TodoItem = ({ 
  todo, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  isUpdating,
  isDeleting 
}: TodoItemProps) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleComplete = async () => {
    setIsToggling(true);
    try {
      await onToggleComplete(todo.id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    await onDelete(todo.id);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={cn(
      "bg-card rounded-lg p-6 shadow-card border border-border transition-all duration-200 hover:shadow-soft",
      todo.completed && "bg-success-light/30 border-success/20",
      (isUpdating || isDeleting) && "opacity-60 pointer-events-none"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="relative flex items-center pt-1">
            {isToggling ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Checkbox
                checked={todo.completed}
                onCheckedChange={handleToggleComplete}
                className="h-5 w-5 data-[state=checked]:bg-success data-[state=checked]:border-success"
              />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "text-lg font-semibold text-foreground mb-2 transition-colors",
              todo.completed && "line-through text-muted-foreground"
            )}>
              {todo.title}
            </h3>
            
            {todo.description && (
              <p className={cn(
                "text-muted-foreground text-sm leading-relaxed mb-3",
                todo.completed && "line-through opacity-75"
              )}>
                {todo.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <span className="text-base">
                  {todo.priority === 'high' ? '🔴' : todo.priority === 'medium' ? '🟡' : '🟢'}
                </span>
                <span className="capitalize font-medium">{todo.priority}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Created {formatDate(todo.createdAt)}</span>
              </div>
              {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
                <div className="flex items-center space-x-1">
                  <span>•</span>
                  <span>Updated {formatDate(todo.updatedAt)}</span>
                </div>
              )}
              {todo.completed && (
                <div className="flex items-center space-x-1 text-success">
                  <Check className="h-3 w-3" />
                  <span className="font-medium">Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(todo)}
            disabled={isUpdating || isDeleting}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isUpdating || isDeleting}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};