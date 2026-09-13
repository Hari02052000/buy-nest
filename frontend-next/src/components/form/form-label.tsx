'use client';

import * as React from 'react';
import { useOptionalFormField } from './form-field';
import { Label } from '@/components/ui/label';

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

function FormLabel({ className, htmlFor, children, required, ...props }: FormLabelProps) {
  const { fieldId } = useOptionalFormField();

  return (
    <Label htmlFor={htmlFor ?? fieldId} className={className} {...props}>
      {children}
      {required && (
        <span aria-hidden="true" className="ml-1 text-destructive">
          *
        </span>
      )}
    </Label>
  );
}

export { FormLabel, type FormLabelProps };
