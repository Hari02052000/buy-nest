'use client';

import { createContext,useContext,useId } from 'react';
import { cn } from '@/lib/cn';

interface FormFieldContextValue {
  name?: string;
  error?: string;
  description?: string;
  fieldId: string;
}

const FormFieldContext = createContext<FormFieldContextValue>({
  fieldId: '',
});

function useFormField() {
  const context = useContext(FormFieldContext);
  if (!context) {
    throw new Error('Form components must be used within FormField');
  }
  return context;
}

function useOptionalFormField() {
  return useContext(FormFieldContext);
}

interface FormFieldProps {
  name?: string;
  error?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

function FormField({ name, error, description, className, children }: FormFieldProps) {
  const fieldId = useId();

  return (
    <FormFieldContext.Provider value={{ name, error, description, fieldId }}>
      <div className={cn('space-y-2', className)}>
        {children}
      </div>
    </FormFieldContext.Provider>
  );
}

export {
  FormField,
  useFormField,
  useOptionalFormField,
  type FormFieldProps,
  type FormFieldContextValue,
};
