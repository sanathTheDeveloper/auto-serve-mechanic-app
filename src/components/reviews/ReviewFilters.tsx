import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, SortAsc } from "lucide-react";
import { ReviewSort, ReviewFilterState } from "@/types/review";

interface ReviewFiltersProps {
  filterState: ReviewFilterState;
  onSortChange: (sort: ReviewSort) => void;
  onSearchChange: (search: string) => void;
}

export function ReviewFilters({ 
  filterState, 
  onSortChange, 
  onSearchChange
}: ReviewFiltersProps) {

  const sortOptions = [
    { value: 'newest' as ReviewSort, label: 'Newest First' },
    { value: 'oldest' as ReviewSort, label: 'Oldest First' },
    { value: 'rating-high' as ReviewSort, label: 'Highest Rating' },
    { value: 'rating-low' as ReviewSort, label: 'Lowest Rating' },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-blue-200/50 shadow-card p-4">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search reviews, customers, or vehicles..."
            value={filterState.searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 bg-slate-50 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
          <SortAsc className="h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-600 font-medium">Sort:</span>
          <Select value={filterState.sort} onValueChange={onSortChange}>
            <SelectTrigger className="w-36 border-none bg-transparent text-slate-700 font-medium">
              <SelectValue placeholder="Choose..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Search Filter */}
      {filterState.searchQuery && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-blue-200/30">
          <Badge variant="outline" className="text-sm px-3 py-1 bg-amber-50 text-amber-700 border-amber-200">
            Search: &ldquo;{filterState.searchQuery}&rdquo;
            <button
              onClick={() => onSearchChange('')}
              className="ml-2 text-amber-600 hover:text-red-600 font-bold"
            >
              ×
            </button>
          </Badge>
        </div>
      )}
    </div>
  );
}