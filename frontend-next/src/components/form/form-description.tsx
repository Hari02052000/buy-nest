'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { useFormField } from './form-field';

interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

function FormDescription({ className, children, ...props }: FormDescriptionProps) {
  const { fieldId } = useFormField();
  const descriptionId = React.useId();

  const isStandalone = !fieldId;

  if (isStandalone) {
    return (
      <p className={cn('text-sm text-muted-foreground', className)} {...props}>
        {children}
      </p>
    );
  }

  return (
    <p id={descriptionId} className={cn('text-sm text-muted-foreground', className)} {...props}>
      {children}
    </p>
  );
}

export { FormDescription, type FormDescriptionProps };
