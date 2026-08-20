"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Spinner from "@/components/common/ui/Spinner";
import { cn } from "@/lib/utils/cn";

interface GlobalSearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function GlobalSearchBar({
  onSearch,
  isLoading = false,
  placeholder = "Search...",
}: GlobalSearchBarProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, onSearch]);

  const clear = () => {
    setValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setValue("");
      inputRef.current?.blur();
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 bg-bg-subtle border border-border-base rounded px-3",
        "focus-within:border-border-focus focus-within:ring-2 focus-within:ring-accent/20",
        "transition-all duration-100"
      )}
    >
      <Search size={16} className="text-text-tertiary flex-shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 text-sm text-text-primary placeholder:text-text-tertiary bg-transparent outline-none py-2"
      />
      {isLoading && <Spinner size="sm" />}
      {value && !isLoading && (
        <button
          onClick={clear}
          className="text-text-tertiary hover:text-text-primary transition-colors duration-100"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
