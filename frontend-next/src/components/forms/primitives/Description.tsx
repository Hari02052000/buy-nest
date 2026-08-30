"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const Description = React.forwardRef<HTMLParagraphElement, DescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  )
);
Description.displayName = "Description";