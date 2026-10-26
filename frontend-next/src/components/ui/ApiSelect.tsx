"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { useState, useMemo } from "react";
import { ChevronDownIcon, SearchIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ApiSelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  "aria-label"?: string;
  id?: string;
  className?: string;
  selectedLabel?: string;
}

const Select = SelectPrimitive.Root;
const SelectTrigger = SelectPrimitive.Trigger;
const SelectValue = SelectPrimitive.Value;
const SelectIcon = SelectPrimitive.Icon;
const SelectPortal = SelectPrimitive.Portal;
const SelectContent = SelectPrimitive.Content;
const SelectViewport = SelectPrimitive.Viewport;
const SelectItem = SelectPrimitive.Item;
const SelectItemText = SelectPrimitive.ItemText;
const SelectGroup = SelectPrimitive.Group;
const SelectScrollUpButton = SelectPrimitive.ScrollUpButton;
const SelectScrollDownButton = SelectPrimitive.ScrollDownButton;

function SkeletonTrigger() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-5 w-40 animate-pulse bg-surface-subtle rounded" />
      <ChevronDownIcon className="h-4 w-4 text-foreground-muted" />
    </div>
  );
}

function SkeletonDropdown() {
  return (
    <div className="p-2 space-y-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-8 animate-pulse bg-surface-subtle rounded px-3" />
      ))}
    </div>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="sticky top-0 z-10 p-2 border-b border-border bg-surface">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-8 h-8 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
            aria-label="Clear search"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyMessage({ message }: { message: string }) {
  return (
    <div className="p-3 text-center text-sm text-foreground-muted" role="status">
      {message}
    </div>
  );
}

export function ApiSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  loading = false,
  error,
  searchable = false,
  searchPlaceholder = "Search...",
  emptyMessage = "No options available",
  "aria-label": ariaLabel,
  id,
  className,
  selectedLabel,
}: ApiSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, searchable, searchQuery]);

  const hasValue = value !== undefined && value !== "";
  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedLabel ?? selectedOption?.label;

  return (
    <Select
      value={value ?? ""}
      onValueChange={onChange}
      disabled={disabled || loading}
      dir="ltr"
    >
      <SelectTrigger
        id={id}
        aria-label={ariaLabel}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-sm bg-surface border rounded-md transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          loading
            ? "cursor-wait"
            : disabled
            ? "opacity-50 cursor-not-allowed border-border"
            : error
            ? "border-error-foreground focus:ring-error-foreground"
            : "border-border hover:border-primary/50",
          className
        )}
      >
        {loading ? (
          <SkeletonTrigger />
        ) : (
          <>
            <SelectValue placeholder={placeholder} className={cn(
              "flex-1 text-left truncate",
              hasValue ? "text-foreground" : "text-foreground-muted"
            )}>
              {hasValue ? displayLabel : placeholder}
            </SelectValue>
            <SelectIcon>
              <ChevronDownIcon className="h-4 w-4 text-foreground-muted flex-shrink-0 transition-transform" />
            </SelectIcon>
          </>
        )}
      </SelectTrigger>

      {error && (
        <p className="mt-1 text-sm text-error-foreground" role="alert">
          {error}
        </p>
      )}

      <SelectPortal>
        <SelectContent
          className={cn(
            "z-[60] w-full max-h-80 overflow-hidden bg-surface border border-border rounded-md shadow-lg animate-in fade-in-150",
            searchable && "p-0"
          )}
          position="popper"
          sideOffset={4}
        >
          {loading ? (
            <SelectViewport>
              <SkeletonDropdown />
            </SelectViewport>
          ) : (
            <>
              {searchable && (
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={searchPlaceholder}
                />
              )}
              <SelectViewport className={cn("max-h-60", searchable && "pt-0")}>
                {filteredOptions.length === 0 ? (
                  <EmptyMessage message={searchQuery.trim() ? "No matches found" : emptyMessage} />
                ) : (
                  <SelectGroup>
                    {options.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled || disabled}
                        className={cn(
                          "relative flex w-full cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none",
                          "focus:bg-primary focus:text-primary-foreground",
                          "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
                          "data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground",
                          "data-[selected]:bg-primary data-[selected]:text-primary-foreground",
                          "data-[selected]:data-[highlighted]:bg-primary data-[selected]:data-[highlighted]:text-primary-foreground"
                        )}
                      >
                        <SelectItemText className={cn(
                          "truncate",
                          option.disabled && "opacity-50"
                        )}>
                          {option.label}
                        </SelectItemText>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </SelectViewport>
              <SelectScrollUpButton className="flex cursor-default items-center justify-center py-1">
                <ChevronDownIcon className="h-4 w-4 rotate-180" />
              </SelectScrollUpButton>
              <SelectScrollDownButton className="flex cursor-default items-center justify-center py-1">
                <ChevronDownIcon className="h-4 w-4" />
              </SelectScrollDownButton>
            </>
          )}
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}