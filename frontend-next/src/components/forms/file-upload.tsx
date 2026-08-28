"use client";

import * as React from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  id?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onChange: (files: File[]) => void;
  value?: File[];
  previewUrls?: string[];
  onRemove?: (index: number) => void;
  className?: string;
  label?: string;
  error?: string;
}

export function FileUpload({
  id,
  accept = "image/*",
  multiple = false,
  disabled = false,
  onChange,
  value = [],
  previewUrls = [],
  onRemove,
  className,
  label = "Upload images",
  error,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (multiple) {
      onChange([...value, ...files]);
    } else {
      onChange(files.slice(0, 1));
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          {label}
        </Button>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>

      {previewUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previewUrls.map((url, index) => (
            <div
              key={index}
              className="relative h-20 w-20 rounded-md border overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute top-1 right-1 rounded-full bg-background/80 p-0.5 text-foreground hover:bg-background"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}