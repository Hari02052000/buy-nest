'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { useFormField } from './form-field';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

function FormTextarea({
  label,
  description,
  error,
  containerClassName,
  id,
  name,
  disabled,
  readOnly,
  required,
  className,
  value,
  defaultValue,
  onChange,
  placeholder,
  rows = 4,
  ...props
}: FormTextareaProps) {
  const context = useFormField();
  const fieldId = id || context.fieldId;
  const fieldError = error || context.error;
  const fieldDescription = description ?? context.description;
  const fieldName = name || context.name;
  const descriptionId = React.useId();
  const errorId = React.useId();

  const isStandalone = !context.fieldId;

  if (isStandalone && !fieldId) {
    throw new Error('FormTextarea requires an id when used outside FormField');
  }

  const describedBy = [
    fieldDescription ? descriptionId : undefined,
    fieldError ? errorId : undefined,
  ].filter(Boolean).join(' ') || undefined;

  const textareaElement = (
    <textarea
      id={fieldId}
      name={fieldName}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      rows={rows}
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        fieldError && 'border-destructive focus-visible:ring-destructive',
        className
      )}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      placeholder={placeholder}
      aria-invalid={!!fieldError}
      aria-describedby={describedBy}
      {...props}
    />
  );

  if (isStandalone) {
    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label htmlFor={fieldId} className="text-sm font-medium leading-none">
            {label}
          </label>
        )}
        {textareaElement}
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

  return textareaElement;
}

export { FormTextarea, type FormTextareaProps };
