"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
}

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
    <div className="relative p-2 border-b border-border">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
      <input
        type="text"
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
  );
}

function DropdownContent({
  options,
  value,
  onChange,
  disabled,
  searchable,
  searchPlaceholder,
  emptyMessage,
  searchQuery,
  setSearchQuery,
  filteredOptions,
  ariaLabel,
  onClose,
  contentRef,
  style,
}: {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  disabled: boolean;
  searchable: boolean;
  searchPlaceholder: string;
  emptyMessage: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filteredOptions: SelectOption[];
  ariaLabel?: string;
  onClose: () => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
}) {
  return (
    <div
      ref={contentRef}
      style={style}
      className="z-[60] w-full max-h-60 overflow-auto bg-surface border border-border rounded-md shadow-lg animate-in fade-in-150"
      role="listbox"
      aria-label={ariaLabel}
    >
      {searchable && (
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={searchPlaceholder}
        />
      )}
      {filteredOptions.length === 0 ? (
        <div className="p-3 text-center text-sm text-foreground-muted">
          {searchQuery.trim() ? "No matches found" : emptyMessage}
        </div>
      ) : (
        <div className="py-1">
          {filteredOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              disabled={option.disabled || disabled}
              onClick={() => {
                if (!option.disabled && !disabled) {
                  onChange(option.value);
                  onClose();
                }
              }}
              className={cn(
                "w-full px-3 py-2 text-sm text-left transition-colors",
                "focus:outline-none focus:bg-primary focus:text-primary-foreground",
                value === option.value
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-surface-subtle",
                option.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LoadingDropdownContent({ contentRef, ariaLabel, style }: { contentRef: React.RefObject<HTMLDivElement | null>; ariaLabel?: string; style?: React.CSSProperties }) {
  return (
    <div
      ref={contentRef}
      style={style}
      className="z-[60] w-full max-h-60 bg-surface border border-border rounded-md shadow-lg animate-in fade-in-150"
      role="listbox"
      aria-label={ariaLabel}
    >
      <SkeletonDropdown />
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
}: ApiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, searchable, searchQuery]);

  const hasValue = value !== undefined && value !== "";
  const selectedOption = options.find((opt) => opt.value === value);

  // Calculate dropdown position
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
        maxHeight: "240px",
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, { passive: true });
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
        contentRef.current && !contentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const openDropdown = () => {
    if (!disabled && !loading) {
      setIsOpen(true);
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const dropdownContent = isOpen && !loading ? (
    <DropdownContent
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled}
      searchable={searchable}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={emptyMessage}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      filteredOptions={filteredOptions}
      ariaLabel={ariaLabel}
      onClose={closeDropdown}
      contentRef={contentRef}
      style={dropdownStyle}
    />
  ) : isOpen && loading ? (
    <LoadingDropdownContent contentRef={contentRef} ariaLabel={ariaLabel} style={dropdownStyle} />
  ) : null;

  const portalTarget = typeof document !== "undefined" ? document.body : null;

  return (
    <div className={cn("relative w-full", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={openDropdown}
        disabled={disabled || loading}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        id={id}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-sm bg-surface border rounded-md transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          loading
            ? "cursor-wait"
            : disabled
            ? "opacity-50 cursor-not-allowed border-border"
            : error
            ? "border-error-foreground focus:ring-error-foreground"
            : "border-border hover:border-primary/50"
        )}
      >
        {loading ? (
          <SkeletonTrigger />
        ) : (
          <>
            <span className={cn(
              "flex-1 text-left truncate",
              hasValue ? "text-foreground" : "text-foreground-muted"
            )}>
              {hasValue ? selectedOption?.label : placeholder}
            </span>
            <ChevronDownIcon className={cn(
              "h-4 w-4 text-foreground-muted flex-shrink-0 transition-transform",
              isOpen && "rotate-180"
            )} />
          </>
        )}
      </button>

      {error && (
        <p className="mt-1 text-sm text-error-foreground" role="alert">
          {error}
        </p>
      )}

      {portalTarget && dropdownContent && createPortal(
        <div className="fixed">
          {dropdownContent}
        </div>,
        portalTarget
      )}
    </div>
  );
}