"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "../primitives/Label";
import { Description } from "../primitives/Description";
import { ErrorMessage } from "../primitives/ErrorMessage";

export interface FormFieldRenderProps {
  field: {
    id: string;
    name: string;
    ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
    "aria-describedby"?: string;
    "aria-invalid": boolean;
  };
  fieldState: {
    error?: string;
  };
}

export interface FormFieldProps {
  name: string;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
  render: (props: FormFieldRenderProps) => React.ReactNode;
}

export function FormField({
  name,
  label,
  description,
  error,
  required,
  className,
  render,
}: FormFieldProps) {
  const baseId = name.replace(/[\[\].]/g, "-");
  const descriptionId = description ? `${baseId}-hint` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  const renderProps: FormFieldRenderProps = {
    field: {
      id: baseId,
      name,
      ref: undefined as React.Ref<HTMLInputElement | HTMLTextAreaElement> | undefined,
      "aria-describedby": describedBy,
      "aria-invalid": !!error,
    },
    fieldState: {
      error,
    },
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={baseId} required={required}>
          {label}
        </Label>
      )}
      {render(renderProps)}
      {description && !error && <Description id={descriptionId}>{description}</Description>}
      {error && <ErrorMessage id={errorId}>{error}</ErrorMessage>}
    </div>
  );
}