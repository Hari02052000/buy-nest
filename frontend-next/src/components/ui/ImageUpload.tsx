"use client";

import { useState, useRef, useCallback, type DragEvent } from "react";
import { UploadIcon, XIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: { url: string; id: string } | null;
  onChange: (file: File | null) => void;
  onRemove?: () => void;
  disabled?: boolean;
  maxSizeMB?: number;
  accept?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  maxSizeMB = 5,
  accept = "image/*",
  className,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const clearPreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
  }, []);

  const handleFileSelect = useCallback(
    (file: File | null) => {
      clearPreview();

      if (!file) {
        onChange(null);
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("File must be an image");
        return;
      }

      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setPreviewUrl(url);
      onChange(file);
    },
    [clearPreview, maxSizeMB, onChange]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [disabled, handleFileSelect]
  );

  const handleClick = useCallback(() => {
    if (!disabled) fileInputRef.current?.click();
  }, [disabled]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      handleFileSelect(file);
      if (e.target) e.target.value = "";
    },
    [handleFileSelect]
  );

  const handleRemove = useCallback(() => {
    clearPreview();
    onChange(null);
    onRemove?.();
  }, [clearPreview, onChange, onRemove]);

  const displayUrl = previewUrl || value?.url || null;

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
        id="image-upload"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer",
          disabled
            ? "opacity-50 cursor-not-allowed bg-surface-subtle"
            : isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-surface-subtle"
        )}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label="Upload image"
      >
        {displayUrl ? (
          <div className="relative w-full max-w-xs mx-auto">
            <img
              src={displayUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 rounded-full bg-error-foreground/90 text-error p-1 hover:bg-error-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-error-foreground focus:ring-offset-2"
                aria-label="Remove image"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <UploadIcon className="mx-auto h-12 w-12 text-foreground-muted" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {value ? "Click to change" : "Click to upload"}
              </p>
              <p className="text-xs text-foreground-muted">
                {value
                  ? "PNG, JPG up to 5MB"
                  : "PNG, JPG up to 5MB"}
              </p>
            </div>
          </div>
        )}
      </div>

      {displayUrl && !disabled && (
        <p className="mt-2 text-xs text-foreground-muted text-center">
          Click image to change, or use the remove button
        </p>
      )}
    </div>
  );
}