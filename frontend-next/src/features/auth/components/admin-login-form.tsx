'use client';

import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { adminLogin } from '@/lib/api/auth';
import { adminLoginSchema, type AdminLoginFormValues } from '../schemas/login.schema';
import { FormField, FormLabel, FormInput, FormMessage } from '@/components/form';
import { Button } from '@/components/ui/button';

function AdminLoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
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

        <FormField
          name="email"
          error={form.formState.errors.email?.message}
        >
          <FormLabel>Email address</FormLabel>
          <FormInput
            type="email"
            placeholder="admin@buynest.com"
            autoComplete="email"
            required
          />
        </FormField>

        <FormField
          name="password"
          error={form.formState.errors.password?.message}
        >
          <FormLabel>Password</FormLabel>
          <div className="relative">
            <FormInput
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FormField>

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
