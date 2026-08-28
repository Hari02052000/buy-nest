"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CartBadgeProps {
  count: number;
  className?: string;
}

export function CartBadge({ count, className }: CartBadgeProps) {
  if (count <= 0) return null;

  return (
    <Badge
      variant="destructive"
      className={cn(
        "absolute -top-2 -right-2 h-5 min-w-5 justify-center rounded-full px-1 text-xs",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
}