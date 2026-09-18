import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Applies error/invalid visual styling to the input.
   * Also automatically triggered if `aria-invalid` is true or "true".
   */
  hasError?: boolean;
}

/**
 * Low-level reusable UI primitive rendering a native `<input>`.
 * Feature-agnostic and usable independently of React Hook Form or Zod.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", hasError, disabled, ...props }, ref) => {
    const isInvalid =
      hasError ||
      props["aria-invalid"] === true ||
      props["aria-invalid"] === "true";

    return (
      <input
        type={type}
        ref={ref}
        disabled={disabled}
        className={cn(
          "w-full h-10 px-3 py-2 text-sm rounded-md border bg-surface text-foreground placeholder:text-foreground-muted transition-colors duration-150 outline-none",
          isInvalid
            ? "border-error-foreground focus:border-error-foreground focus:ring-1 focus:ring-error-foreground"
            : "border-border hover:border-border-strong focus:border-primary focus:ring-1 focus:ring-primary",
          "disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-foreground-muted disabled:hover:border-border",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
