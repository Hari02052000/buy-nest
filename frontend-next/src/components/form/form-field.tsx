'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

interface FormFieldContextValue {
  name?: string;
  error?: string;
  description?: string;
  fieldId: string;
}

const FormFieldContext = React.createContext<FormFieldContextValue>({
  fieldId: '',
});

function useFormField() {
  const context = React.useContext(FormFieldContext);
  if (!context) {
    throw new Error('Form components must be used within FormField');
  }
  return context;
}

interface FormFieldProps {
  name?: string;
  error?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

function FormField({ name, error, description, className, children }: FormFieldProps) {
  const fieldId = React.useId();

  return (
    <FormFieldContext.Provider value={{ name, error, description, fieldId }}>
      <div className={cn('space-y-2', className)}>
        {children}
      </div>
    </FormFieldContext.Provider>
  );
}

export { FormField, useFormField, type FormFieldProps, type FormFieldContextValue };
