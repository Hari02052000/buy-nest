"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/Button";
import { ShakeProvider, useShakeContext } from "@/components/form/ShakeContext";
import { loginSchema, type LoginFormData } from "./login.schema";
import { login, type AuthError } from "./auth.service";

/**
 * Admin Login Form Component.
 *
 * Handles form state, validation, submission, and error display.
 * Uses React Hook Form with Zod validation.
 * Communicates with auth.service for authentication.
 */
function LoginFormInner() {
  const router = useRouter();
  const { requestShakeFirstInvalid } = useShakeContext();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [authError, setAuthError] = useState<string | null>(null);
  const isSubmitting = form.formState.isSubmitting;
  const isSubmitted = form.formState.isSubmitted;
  const errors = form.formState.errors;

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);

    try {
      await login(data);
      router.replace("/admin");
      router.refresh();
    } catch (error) {
      const authErr = error as AuthError;
      setAuthError(authErr.message);
      requestShakeFirstInvalid();
    }
  };

  // Trigger shake on validation failure after submit
  useEffect(() => {
    if (isSubmitted && (errors.email || errors.password)) {
      requestShakeFirstInvalid();
    }
  }, [isSubmitted, errors.email, errors.password, requestShakeFirstInvalid]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {authError && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-center gap-2 p-3 rounded-md bg-error text-error-foreground text-sm"
        >
          <svg
            className="h-5 w-5 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <span>{authError}</span>
        </div>
      )}

      <FormInput
        control={form.control}
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        required
        autoComplete="email"
      />

      <FormInput
        control={form.control}
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        required
        showPasswordToggle
        autoComplete="current-password"
      />

      <Button
        type="submit"
        className="w-full"
        size="md"
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        Sign in
      </Button>
    </form>
  );
}

export function LoginForm() {
  return (
    <ShakeProvider>
      <LoginFormInner />
    </ShakeProvider>
  );
}