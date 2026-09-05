'use client';

import * as React from 'react';
import { useFormField } from './form-field';
import { Label } from '@/components/ui/label';

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

function FormLabel({ className, children, ...props }: FormLabelProps) {
  const { fieldId } = useFormField();

  return (
    <Label htmlFor={fieldId} className={className} {...props}>
      {children}
    </Label>
  );
}

export { FormLabel, type FormLabelProps };
