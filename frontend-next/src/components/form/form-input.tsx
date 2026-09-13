'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Input } from '@/components/ui/input';
import { useOptionalFormField } from './form-field';
import { FormLabel } from './form-label';

interface FormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
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
      'aria-describedby': ariaDescribedByProp,
      'aria-invalid': ariaInvalidProp,
      ...props
    },
    ref
  ) => {
    const context = useOptionalFormField();
    const fieldId = id || context.fieldId || React.useId();
    const fieldError = error || context.error;
    const fieldDescription = description ?? context.description;
    const fieldName = name || context.name;
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';

    const isStandalone = !context.fieldId;

    const descriptionId = React.useId();
    const errorId = React.useId();

    const describedBy = [
      ariaDescribedByProp,
      fieldDescription ? descriptionId : undefined,
      fieldError ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    const inputElement = (
      <div className="relative">
        <Input
          ref={ref}
          id={fieldId}
          name={fieldName}
          type={isPassword && showPassword ? 'text' : type}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className={cn(fieldError && 'border-destructive focus-visible:ring-destructive', className)}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={ariaInvalidProp ?? !!fieldError}
          aria-describedby={describedBy}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    );

    if (isStandalone) {
      return (
        <div className={cn('space-y-2', containerClassName)}>
          {label && <FormLabel htmlFor={fieldId} required={required}>{label}</FormLabel>}
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
);

FormInput.displayName = 'FormInput';

export { FormInput, type FormInputProps };
