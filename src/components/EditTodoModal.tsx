import { useState, useEffect } from 'react';
import { Save, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Todo } from '@/types/todo';

interface EditTodoModalProps {
  todo: Todo | null;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSave: (id: string, title: string, description: string, priority: 'low' | 'medium' | 'high') => Promise<void>;
}

export const EditTodoModal = ({ todo, isOpen, isLoading, onClose, onSave }: EditTodoModalProps) => {
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(todo?.priority || 'medium');

  // Update local state when todo changes
  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
      setPriority(todo.priority);
    }
  }, [todo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo || !title.trim()) return;

    try {
      await onSave(todo.id, title.trim(), description.trim(), priority);
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleClose = () => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
      setPriority(todo.priority);
    }
    onClose();
  };

  if (!todo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Edit Todo
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Todo title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              className="font-medium"
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              className="min-h-[80px] resize-none"
            />
          </div>
          
          <div>
            <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">🔴 High Priority</SelectItem>
                <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                <SelectItem value="low">🟢 Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || isLoading}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};