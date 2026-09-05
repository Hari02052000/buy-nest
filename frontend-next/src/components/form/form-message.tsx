'use client';

import * as React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/cn';

interface FormMessageProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'error' | 'success';
}

function FormMessage({ children, className, variant = 'default' }: FormMessageProps) {
  if (!children) return null;

  if (variant === 'error') {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-destructive', className)} role="alert">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{children}</span>
      </div>
    );
  }

  if (variant === 'success') {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-success', className)}>
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>{children}</span>
      </div>
    );
  }

  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  );
}

export { FormMessage, type FormMessageProps };
