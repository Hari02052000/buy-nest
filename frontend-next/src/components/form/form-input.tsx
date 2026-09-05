'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Input } from '@/components/ui/input';
import { useFormField } from './form-field';
import { FormLabel } from './form-label';

interface FormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

function FormInput({
  label,
  description,
  error,
  containerClassName,
  id,
  name,
  type,
  disabled,
  readOnly,
  required,
  autoComplete,
  inputMode,
  className,
  value,
  defaultValue,
  onChange,
  placeholder,
  ...props
}: FormInputProps) {
  const context = useFormField();
  const fieldId = id || context.fieldId;
  const fieldError = error || context.error;
  const fieldDescription = description ?? context.description;
  const fieldName = name || context.name;
  const descriptionId = React.useId();
  const errorId = React.useId();
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';

  const isStandalone = !context.fieldId;

  if (isStandalone && !fieldId) {
    throw new Error('FormInput requires an id when used outside FormField');
  }

  const describedBy = [
    fieldDescription ? descriptionId : undefined,
    fieldError ? errorId : undefined,
  ].filter(Boolean).join(' ') || undefined;

  const inputElement = (
    <div className="relative">
      <Input
        id={fieldId}
        name={fieldName}
        type={isPassword && showPassword ? 'text' : type}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={cn(fieldError && 'border-destructive focus-visible:ring-destructive', className)}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={!!fieldError}
        aria-describedby={describedBy}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
  );

  if (isStandalone) {
    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && <FormLabel>{label}</FormLabel>}
        {inputElement}
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

  return inputElement;
}

export { FormInput, type FormInputProps };
