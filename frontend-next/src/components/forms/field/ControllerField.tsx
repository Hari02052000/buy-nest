"use client";

import * as React from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "../primitives/Label";
import { Description } from "../primitives/Description";
import { ErrorMessage } from "../primitives/ErrorMessage";

export interface ControllerFieldRenderProps<T extends FieldValues> {
  field: {
    name: string;
    value: unknown;
    onChange: (...event: unknown[]) => void;
    onBlur: (...event: unknown[]) => void;
    ref: React.Ref<unknown>;
  };
  fieldState: {
    error?: { message?: string } | string | undefined;
    isDirty?: boolean;
    isTouched?: boolean;
    isValid?: boolean;
  };
  error?: string;
  label?: string;
  description?: string;
  required?: boolean;
  baseId: string;
  descriptionId?: string;
  errorId?: string;
}

export interface ControllerFieldProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  description?: string;
  required?: boolean;
  className?: string;
  render: (props: ControllerFieldRenderProps<T>) => React.ReactNode;
}

export function ControllerField<T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  description,
  required,
  className,
  render,
}: ControllerFieldProps<T>) {
  const baseId = String(name).replace(/[\[\].]/g, "-");
  const descriptionId = description ? `${baseId}-hint` : undefined;
  const errorId = `${baseId}-error`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const error = fieldState.error?.message as string | undefined;

        return (
          <div className={cn("space-y-1.5", className)}>
            {label && (
              <Label htmlFor={baseId} required={required}>
                {label}
              </Label>
            )}
            {render({
              field: {
                name: field.name,
                value: field.value,
                onChange: field.onChange,
                onBlur: field.onBlur,
                ref: field.ref,
              },
              fieldState,
              error,
              label,
              description,
              required,
              baseId,
              descriptionId,
              errorId,
            })}
            {description && !error && <Description id={descriptionId}>{description}</Description>}
            {error && <ErrorMessage id={errorId}>{error}</ErrorMessage>}
          </div>
        );
      }}
    />
  );
}