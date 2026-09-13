'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';
import { useFormField } from './form-field';

interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

function FormError({ className, children, ...props }: FormErrorProps) {
  const { error, fieldId } = useFormField();
  const errorId = useId();
  const message = children || error;

  if (!message) return null;

  const isStandalone = !fieldId;

  if (isStandalone) {
    return (
      <p className={cn('text-sm text-destructive', className)} role="alert" {...props}>
        {message}
      </p>
    );
  }

  return (
    <p id={errorId} className={cn('text-sm text-destructive', className)} role="alert" {...props}>
      {message}
    </p>
  );
}

export { FormError, type FormErrorProps };
