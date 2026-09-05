'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { useFormField } from './form-field';

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'readOnly'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

function FormSelect({
  label,
  description,
  error,
  containerClassName,
  id,
  name,
  disabled,
  required,
  className,
  value,
  defaultValue,
  onChange,
  children,
  ...props
}: FormSelectProps) {
  const context = useFormField();
  const fieldId = id || context.fieldId;
  const fieldError = error || context.error;
  const fieldDescription = description ?? context.description;
  const fieldName = name || context.name;
  const descriptionId = React.useId();
  const errorId = React.useId();

  const isStandalone = !context.fieldId;

  if (isStandalone && !fieldId) {
    throw new Error('FormSelect requires an id when used outside FormField');
  }

  const describedBy = [
    fieldDescription ? descriptionId : undefined,
    fieldError ? errorId : undefined,
  ].filter(Boolean).join(' ') || undefined;

  const selectElement = (
    <select
      id={fieldId}
      name={fieldName}
      disabled={disabled}
      required={required}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        fieldError && 'border-destructive focus-visible:ring-destructive',
        className
      )}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      aria-invalid={!!fieldError}
      aria-describedby={describedBy}
      {...props}
    >
      {children}
    </select>
  );

  if (isStandalone) {
    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label htmlFor={fieldId} className="text-sm font-medium leading-none">
            {label}
          </label>
        )}
        {selectElement}
        {fieldDescription && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {fieldDescription}
          </p>
        )}
        {fieldError && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {fieldError}
          </p>
        )}
      </div>
    );
  }

  return selectElement;
}

export { FormSelect, type FormSelectProps };
