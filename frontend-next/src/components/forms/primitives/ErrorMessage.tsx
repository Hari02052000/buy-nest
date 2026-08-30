"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const ErrorMessage = React.forwardRef<HTMLParagraphElement, ErrorMessageProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      role="alert"
      aria-live="polite"
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  )
);
ErrorMessage.displayName = "ErrorMessage";