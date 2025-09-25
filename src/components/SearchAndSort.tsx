import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchAndSortProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export const SearchAndSort = ({ 
  searchTerm, 
  onSearchChange, 
  sortBy, 
  onSortChange 
}: SearchAndSortProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search todos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="alphabetical">A-Z</SelectItem>
          <SelectItem value="alphabetical-desc">Z-A</SelectItem>
          <SelectItem value="priority">Priority (High-Low)</SelectItem>
          <SelectItem value="priority-desc">Priority (Low-High)</SelectItem>
          <SelectItem value="completed">Completed First</SelectItem>
          <SelectItem value="incomplete">Incomplete First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};