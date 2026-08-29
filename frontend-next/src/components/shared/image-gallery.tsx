"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductImage } from "@/lib/api/types";

interface ImageGalleryProps {
  existingImages?: ProductImage[];
  newFiles?: File[];
  onNewFilesChange?: (files: File[]) => void;
  onDeleteExisting?: (image: ProductImage) => void;
  maxFiles?: number;
  disabled?: boolean;
}

export function ImageGallery({
  existingImages = [],
  newFiles = [],
  onNewFilesChange,
  onDeleteExisting,
  maxFiles = 10,
  disabled = false,
}: ImageGalleryProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const newPreviews = React.useMemo(
    () => newFiles.map((f) => URL.createObjectURL(f)),
    [newFiles],
  );

  React.useEffect(() => {
    return () => newPreviews.forEach((u) => URL.revokeObjectURL(u));
  }, [newPreviews]);

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const total = existingImages.length + newFiles.length + files.length;
    if (total > maxFiles) {
      files.splice(maxFiles - total);
    }
    onNewFilesChange?.([...newFiles, ...files]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeNew = (index: number) => {
    const next = newFiles.filter((_, i) => i !== index);
    onNewFilesChange?.(next);
  };

  const totalCount = existingImages.length + newFiles.length;
  const hasPrimary = existingImages.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {existingImages.map((img) => (
          <div
            key={img.id}
            className="group relative h-24 w-24 overflow-hidden rounded-md border bg-muted"
          >
            <Image
              src={img.url}
              alt="Product image"
              fill
              sizes="96px"
              className="object-cover"
            />
            {!hasPrimary && (
              <span className="absolute left-1 top-1 rounded bg-primary px-1 text-[10px] text-primary-foreground">
                Primary
              </span>
            )}
            {onDeleteExisting && (
              <button
                type="button"
                onClick={() => onDeleteExisting(img)}
                className="absolute right-1 top-1 rounded-full bg-background/80 p-0.5 text-foreground hover:bg-background"
                aria-label="Delete image"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}

        {newFiles.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="group relative h-24 w-24 overflow-hidden rounded-md border bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={newPreviews[index]}
              alt={file.name}
              className="h-full w-full object-cover"
            />
            {!hasPrimary && index === 0 && (
              <span className="absolute left-1 top-1 rounded bg-primary px-1 text-[10px] text-primary-foreground">
                Primary
              </span>
            )}
            <button
              type="button"
              onClick={() => removeNew(index)}
              className="absolute right-1 top-1 rounded-full bg-background/80 p-0.5 text-foreground hover:bg-background"
              aria-label="Remove image"
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleAdd}
        disabled={disabled || totalCount >= maxFiles}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || totalCount >= maxFiles}
      >
        <Upload className="h-4 w-4 mr-2" />
        Add Images ({totalCount}/{maxFiles})
      </Button>
    </div>
  );
}
