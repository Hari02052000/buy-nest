"use client";

import * as React from "react";
import {
  Controller,
  useFormContext,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps<T extends FieldValues = FieldValues> {
  /** Field name (path into form values) */
  name: Path<T>;
  /** Options to render */
  options: SelectOption[];
  /** RHF control — used directly or via FormProvider context */
  control?: Control<T>;
  label?: string;
  placeholder?: string;
  /** Presentational only: shows "*" and sets HTML required attr. Validation is configured by parent. */
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  /** Explicit error message (takes precedence over context error). */
  error?: string;
}

export function FormSelect<T extends FieldValues = FieldValues>({
  name,
  options,
  control: controlProp,
  label,
  placeholder,
  required,
  disabled,
  className,
  description,
  error: errorProp,
}: FormSelectProps<T>) {
  const { control: ctxControl, formState } = useFormContext<T>();
  const control = controlProp ?? ctxControl;
  const contextError = formState.errors?.[name]?.message as string | undefined;

  const wrapperClass = cn("space-y-1.5", className);

  const labelEl = label ? (
    <Label htmlFor={name}>
      {label}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
  ) : null;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const err = errorProp ?? contextError ?? fieldState.error?.message;
        return (
          <div className={wrapperClass}>
            {labelEl}
            <Select
              value={(field.value ?? null) as string | null}
              onValueChange={field.onChange}
              disabled={disabled ?? field.disabled}
            >
              <SelectTrigger id={name} aria-invalid={!!err}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {description && !err && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            {err && (
              <p className="text-sm text-destructive" role="alert">
                {err}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
