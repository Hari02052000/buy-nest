'use client';

import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminLogin } from '@/lib/api/auth';
import { adminLoginSchema, type AdminLoginFormValues } from '../schemas/login.schema';
import { FormInput, FormMessage } from '@/components/form';
import { Button } from '@/components/ui/button';

function AdminLoginForm() {
  const [generalError, setGeneralError] = React.useState<string | null>(null);

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: ({ email, password }: AdminLoginFormValues) => adminLogin(email, password),
    onSuccess: () => {
      window.location.href = '/admin';
    },
    onError: (error) => {
      setGeneralError(error.message || 'Login failed. Please try again.');
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    setGeneralError(null);
    mutation.mutate(data);
  });

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={onSubmit} className="space-y-6">
        {generalError && (
          <FormMessage variant="error">{generalError}</FormMessage>
        )}

        <FormInput
          label="Email address"
          type="email"
          placeholder="admin@buynest.com"
          autoComplete="email"
          required
          error={form.formState.errors.email?.message}
          {...form.register('email')}
        />

        <FormInput
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          error={form.formState.errors.password?.message}
          {...form.register('password')}
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={mutation.isPending}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}

export { AdminLoginForm };
