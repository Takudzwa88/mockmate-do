import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AddTodoFormProps {
  onAddTodo: (title: string, description: string) => Promise<void>;
  isLoading?: boolean;
}

export const AddTodoForm = ({ onAddTodo, isLoading }: AddTodoFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await onAddTodo(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      setIsExpanded(false);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleTitleFocus = () => {
    if (!isExpanded) setIsExpanded(true);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setIsExpanded(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 shadow-card border border-border">
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Add a new todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={handleTitleFocus}
          disabled={isLoading}
          className="text-base font-medium border-border focus:ring-primary focus:border-primary"
        />
        
        {isExpanded && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
            <Textarea
              placeholder="Add a description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              className="min-h-[80px] resize-none border-border focus:ring-primary focus:border-primary"
            />
            
            <div className="flex items-center justify-end space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={isLoading}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!title.trim() || isLoading}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-button transition-all duration-200 hover:shadow-soft"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Todo
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};