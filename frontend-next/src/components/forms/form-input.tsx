 "use client";

import * as React from "react";
import {
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormInputType = "text" | "email" | "password" | "number" | "textarea";

export interface FormInputProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  type?: FormInputType;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  valueAsNumber?: boolean;
  min?: number;
  max?: number;
  step?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];

  /** Ref to the underlying input/textarea (e.g. for auto-focus) */
  inputRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
}

function assignRef<T>(
  ref: React.Ref<T> | undefined,
  value: T | null,
): void {
   if(!ref) return;
   if (typeof ref === "function") {
    ref(value);
    return;
   }
   ref.current = value;
  }
export function FormInput<T extends FieldValues>({
  name,
  register,
  type = "text",
  label,
  placeholder,
  required,
  disabled,
  className,
  error,
  valueAsNumber,
  min,
  max,
  step,
  inputMode,
  inputRef,
}: FormInputProps<T>) {
  const field = register(name, {
    ...(required? {required:true}: {}),
    valueAsNumber: type === "number"?valueAsNumber : undefined,
  });

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && (
            <span className="ml-0.5 text-destructive">*</span>
          )}
        </Label>
      )}

      {type === "textarea" ? (
        <Textarea
          {...field}
          ref={(node) => {
            field.ref(node);
            assignRef(inputRef, node);
          }}
          id={name}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
        />
      ) : (
        <Input
          {...field}
          ref={(node) => {
            field.ref(node);
            assignRef(inputRef, node);
          }}
          id={name}
          type={type}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          inputMode={inputMode}
          aria-invalid={!!error}
        />
      )}

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

