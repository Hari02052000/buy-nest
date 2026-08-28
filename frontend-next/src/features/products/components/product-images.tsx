"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";

interface ProductImageType {
  url: string;
  id: string;
}

interface ProductImagesProps {
  images: ProductImageType[];
  name: string;
  className?: string;
}

export function ProductImages({
  images,
  name,
  className,
}: ProductImagesProps) {
  const [selected, setSelected] = React.useState(0);
  const imageList = images.length > 0 ? images : [{ url: IMAGE_PLACEHOLDER, id: "placeholder" }];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
        <Image
          src={imageList[selected]?.url}
          alt={`${name} - image ${selected + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
          priority
        />
      </div>

      {imageList.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {imageList.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setSelected(index)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                selected === index ? "border-primary" : "border-transparent"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={img.url}
                alt={`${name} thumbnail ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}