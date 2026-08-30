"use client";

import * as React from "react";
import {
  Controller,
  useFormContext,
  type Control,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormDatePickerProps<T extends FieldValues = FieldValues> {
  /** Field name (path into form values) */
  name: Path<T>;
  /** RHF register fn from useForm() — preferred wiring */
  register?: UseFormRegister<T>;
  /** RHF control — used when register is not provided (Controller mode) */
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
  /** When true, register parses the value as a Date object. Default: false (string "YYYY-MM-DD"). */
  valueAsDate?: boolean;
  /** Minimum date (YYYY-MM-DD) */
  min?: string;
  /** Maximum date (YYYY-MM-DD) */
  max?: string;
  /** Ref to the underlying input (e.g. for auto-focus) */
  inputRef?: React.Ref<HTMLInputElement>;
}

function assignRef<T>(
  ref: React.Ref<T> | undefined,
  value: T | null,
): void {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref && typeof ref === "object" && "current" in ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

export function FormDatePicker<T extends FieldValues = FieldValues>({
  name,
  register,
  control: controlProp,
  label,
  placeholder,
  required,
  disabled,
  className,
  description,
  error: errorProp,
  valueAsDate,
  min,
  max,
  inputRef,
}: FormDatePickerProps<T>) {
  const { control: ctxControl, formState } = useFormContext<T>();
  const control = controlProp ?? ctxControl;
  const contextError = formState.errors?.[name]?.message as string | undefined;
  const error = errorProp ?? contextError;

  const wrapperClass = cn("space-y-1.5", className);

  const labelEl = label ? (
    <Label htmlFor={name}>
      {label}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
  ) : null;

  const descriptionEl = description && !error && (
    <p className="text-sm text-muted-foreground">{description}</p>
  );

  const errorEl = error && (
    <p className="text-sm text-destructive" role="alert">
      {error}
    </p>
  );

  if (register) {
    const reg = register(name, {
      valueAsDate: valueAsDate ?? false,
      required,
    });
    const regRef = reg.ref;

    return (
      <div className={wrapperClass}>
        {labelEl}
        <Input
          {...reg}
          ref={(node) => {
            regRef(node);
            assignRef(inputRef, node);
          }}
          id={name}
          type="date"
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          min={min}
          max={max}
        />
        {descriptionEl}
        {errorEl}
      </div>
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const err = errorProp ?? fieldState.error?.message;
        return (
          <div className={wrapperClass}>
            {labelEl}
            <Input
              ref={(node) => {
                field.ref(node);
                assignRef(inputRef, node);
              }}
              id={name}
              type="date"
              placeholder={placeholder}
              required={required}
              disabled={disabled ?? field.disabled}
              aria-invalid={!!err}
              min={min}
              max={max}
              name={field.name}
              value={(field.value ?? "") as string}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
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
