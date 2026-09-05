'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FormField,
  FormLabel,
  FormInput,
  FormTextarea,
  FormSelect,
  FormMessage,
} from '@/components/form';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Alert } from '@/components/ui';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.string().min(1, 'Please select a role'),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function TestFormsPage() {
  const [submittedData, setSubmittedData] = useState<LoginFormValues | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: '',
      bio: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setSubmittedData(data);
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Form System Test</h1>
        <p className="text-muted-foreground">
          Reusable form components compatible with React Hook Form + Zod.
        </p>
      </div>

      <Separator />

      {/* React Hook Form Integration */}
      <Card>
        <CardHeader>
          <CardTitle>React Hook Form + Zod Integration</CardTitle>
          <CardDescription>
            Composed pattern: FormField provides context, children read label/error/description automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              error={form.formState.errors.email?.message}
              description="We'll never share your email with anyone else."
            >
              <FormLabel>Email address</FormLabel>
              <FormInput
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </FormField>

            <FormField
              name="password"
              error={form.formState.errors.password?.message}
              description="Must be at least 8 characters."
            >
              <FormLabel>Password</FormLabel>
              <FormInput
                type="password"
                placeholder="Enter your password"
                autoComplete="new-password"
                required
              />
            </FormField>

            <FormField
              name="role"
              error={form.formState.errors.role?.message}
            >
              <FormLabel>Role</FormLabel>
              <FormSelect required>
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </FormSelect>
            </FormField>

            <FormField
              name="bio"
              error={form.formState.errors.bio?.message}
              description="Optional. Maximum 500 characters."
            >
              <FormLabel>Bio</FormLabel>
              <FormTextarea
                placeholder="Tell us a little about yourself..."
                rows={4}
              />
            </FormField>

            <div className="flex items-center gap-4">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
            </div>
          </form>

          {submittedData && (
            <Alert variant="success" className="mt-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <div>
                  <p className="font-medium">Form submitted successfully</p>
                  <pre className="mt-2 overflow-auto text-xs">
                    {JSON.stringify(submittedData, null, 2)}
                  </pre>
                </div>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Self-contained inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Self-contained Components</CardTitle>
          <CardDescription>
            FormInput, FormTextarea, and FormSelect can be used standalone with explicit props.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormInput
            id="standalone-email"
            label="Email (standalone)"
            type="email"
            placeholder="you@example.com"
            error="This is a standalone error state."
            description="This input demonstrates standalone error and description props."
          />

          <FormTextarea
            id="standalone-bio"
            label="Bio (standalone)"
            placeholder="Write something..."
            description="Helper text below the textarea."
            rows={3}
          />

          <FormSelect
            id="standalone-role"
            label="Role (standalone)"
          >
            <option value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </FormSelect>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              id="disabled-input"
              label="Disabled input"
              placeholder="Cannot edit"
              disabled
            />
            <FormInput
              id="readonly-input"
              label="Read-only input"
              defaultValue="Read-only value"
              readOnly
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              id="required-input"
              label="Required input"
              placeholder="Required field"
              required
            />
            <FormInput
              id="success-input"
              label="Success message"
              defaultValue="Looks good!"
            />
          </div>

          <FormMessage variant="success">This is a success message.</FormMessage>
          <FormMessage variant="error">This is an error message.</FormMessage>
          <FormMessage>This is a default message.</FormMessage>
        </CardContent>
      </Card>
    </div>
  );
}
