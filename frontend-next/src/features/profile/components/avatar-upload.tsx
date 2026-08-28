"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  value?: string;
  fallback?: string;
  onChange?: (file: File) => void;
  className?: string;
}

export function AvatarUpload({
  value,
  fallback = "U",
  onChange,
  className,
}: AvatarUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange?.(file);
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Avatar className="h-16 w-16">
        <AvatarImage src={value} alt="Avatar" />
        <AvatarFallback>{fallback.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-4 w-4 mr-2" />
        Change Photo
      </Button>
    </div>
  );
}