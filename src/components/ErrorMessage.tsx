import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorMessage = ({ message, onDismiss, className = '' }: ErrorMessageProps) => {
  return (
    <div className={`bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-2">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-destructive hover:text-destructive/80 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};