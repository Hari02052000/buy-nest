"use client";

import * as React from "react";
import { type FieldValues, type Path, type UseFormRegister } from "react-hook-form";
import { Input } from "../primitives/Input";
import { Textarea } from "../primitives/Textarea";
import { useRegisterInput } from "../hooks/useRegisterInput";

export type FormInputType = "text" | "email" | "password" | "number" | "textarea";

export interface FormInputProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  type?: FormInputType;
  placeholder?: string;
  required?: boolean;
  requiredMessage?: string;
  disabled?: boolean;
  valueAsNumber?: boolean;
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function FormInput<T extends FieldValues = FieldValues>({
  name,
  register,
  type = "text",
  placeholder,
  required,
  requiredMessage,
  disabled,
  valueAsNumber,
  inputMode,
  min,
  max,
  step,
  className,
  ...rest
}: FormInputProps<T>) {
  const registerProps = useRegisterInput({
    register,
    name,
    requiredMessage,
    valueAsNumber,
  });

  const Component = type === "textarea" ? Textarea : Input;

  return (
    <Component
      {...registerProps}
      {...rest}
      type={type === "textarea" ? undefined : type}
      placeholder={placeholder}
      disabled={disabled}
      inputMode={inputMode}
      min={min}
      max={max}
      step={step}
      className={className}
    />
  );
}