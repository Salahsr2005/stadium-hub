import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onFilter?: () => void;
  className?: string;
}

export const SearchBar = ({
  placeholder = "Search stadiums by name, location...",
  onSearch,
  onFilter,
  className = "",
}: SearchBarProps) => {
  return (
    <div
      className={`flex items-center gap-3 bg-background border-2 border-foreground rounded-lg p-2 shadow-neo-lg ${className}`}
    >
      <div className="flex items-center flex-1 gap-3 px-2">
        <Search className="size-6 text-foreground" strokeWidth={2.5} />
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent text-base font-bold text-foreground placeholder:text-foreground/40 focus:outline-none"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
      <Button variant="outline" size="icon" onClick={onFilter}>
        <SlidersHorizontal strokeWidth={2.5} />
      </Button>
    </div>
  );
};
