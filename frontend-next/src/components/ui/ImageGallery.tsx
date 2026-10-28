"use client";

import { useState, useRef, useCallback, useEffect, type DragEvent } from "react";
import { ImagePlusIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageItem {
  url: string;
  id: string;
}

interface LocalImage {
  id: string;
  url: string;
  file: File;
}

interface ImageGalleryProps {
  images: ImageItem[];
  onAdd: (files: File[]) => void;
  onRemove: (image: ImageItem) => void;
  disabled?: boolean;
  maxSizeMB?: number;
  accept?: string;
  maxImages?: number;
  className?: string;
  error?: string;
}

export function ImageGallery({
  images,
  onAdd,
  onRemove,
  disabled = false,
  maxSizeMB = 5,
  accept = "image/*",
  maxImages,
  className,
  error: errorProp,
}: ImageGalleryProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localImages, setLocalImages] = useState<LocalImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousImageCount = useRef(0);

  // When the server-side `images` prop grows (e.g. after an upload resolves
  // and the list refetches), drop the local optimistic previews so we don't
  // show duplicates.
  useEffect(() => {
    if (images.length > previousImageCount.current && localImages.length > 0) {
      localImages.forEach((img) => URL.revokeObjectURL(img.url));
      setLocalImages([]);
    }
    previousImageCount.current = images.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  // Revoke object URLs on unmount / when local list changes.
  useEffect(() => {
    return () => {
      localImages.forEach((img) => URL.revokeObjectURL(img.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateFiles = useCallback(
    (files: File[]): File[] => {
      setError(null);
      const valid: File[] = [];
      for (const file of files) {
        if (file.size > maxSizeMB * 1024 * 1024) {
          setError(`File size must be less than ${maxSizeMB}MB`);
          continue;
        }
        if (!file.type.startsWith("image/")) {
          setError("File must be an image");
          continue;
        }
        valid.push(file);
      }
      return valid;
    },
    [maxSizeMB]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const arr = Array.from(files);
      const valid = validateFiles(arr);
      if (valid.length === 0) return;

      // Optimistically preview the newly selected files so the UI responds
      // immediately, before the parent finishes uploading them.
      const newLocal: LocalImage[] = valid.map((file, i) => ({
        id: `local-${Date.now()}-${i}-${file.name}`,
        url: URL.createObjectURL(file),
        file,
      }));
      setLocalImages((prev) => [...prev, ...newLocal]);
      onAdd(valid);
    },
    [onAdd, validateFiles]
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
      handleFiles(e.dataTransfer.files);
    },
    [disabled, handleFiles]
  );

  const handleClick = useCallback(() => {
    if (!disabled) fileInputRef.current?.click();
  }, [disabled]);

  const handleRemoveLocal = useCallback(
    (id: string) => {
      setLocalImages((prev) => {
        const target = prev.find((l) => l.id === id);
        if (target) URL.revokeObjectURL(target.url);
        return prev.filter((l) => l.id !== id);
      });
    },
    []
  );

  const isFull = maxImages !== undefined && images.length + localImages.length >= maxImages;

  // Server images come from the `images` prop; local ones are tracked in state.
  const displayImages: Array<ImageItem | LocalImage> = [
    ...images,
    ...localImages,
  ];

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={(e) => {
          handleFiles(e.target.files);
          if (e.target) e.target.value = "";
        }}
        disabled={disabled || isFull}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer",
          disabled || isFull
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
        aria-label="Upload images"
      >
        <div className="flex flex-col items-center gap-2 text-foreground-muted">
          <ImagePlusIcon className="h-8 w-8" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {isFull ? "Maximum images reached" : "Click or drag images here"}
            </p>
            <p className="text-xs">
              PNG, JPG up to {maxSizeMB}MB
              {maxImages ? ` · max ${maxImages}` : ""}
            </p>
          </div>
        </div>
      </div>

      {displayImages.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {displayImages.map((image) => {
            const isLocal = "file" in image;
            const key = image.id;
            return (
              <div key={key} className="relative group">
                <img
                  src={image.url}
                  alt="Product image"
                  className="w-full h-28 object-cover rounded-lg"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isLocal) {
                        handleRemoveLocal(image.id);
                      } else {
                        onRemove(image);
                      }
                    }}
                    className="absolute top-1 right-1 rounded-full bg-black/60 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Remove image"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {(error || errorProp) && (
        <p className="mt-2 text-sm text-error-foreground" role="alert">
          {error || errorProp}
        </p>
      )}
    </div>
  );
}