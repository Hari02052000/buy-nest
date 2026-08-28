"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search products...",
  className,
  debounceMs = 300,
}: SearchBarProps) {
  const [localValue, setLocalValue] = React.useState(value);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (onSearch) {
      debounceRef.current = setTimeout(() => {
        onSearch(newValue);
      }, debounceMs);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localValue);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-9"
        aria-label="Search products"
      />
    </form>
  );
}