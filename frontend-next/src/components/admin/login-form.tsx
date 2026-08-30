"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "@/lib/services/auth-service";
import { Button } from "@/components/ui/button";
import { FormField, FormInput } from "@/components/forms";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const methods = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { register, handleSubmit } = methods;

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    const result = await loginAction(values);
    setIsLoading(false);

    if (result.success) {
      toast.success("Login successful");
      router.push("/admin");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border bg-background p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to the admin panel
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              label="Email"
              required
              render={({ field }: { field: { id: string; name: string; ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>; "aria-describedby"?: string; "aria-invalid": boolean } }) => (
                <FormInput
                  {...field}
                  register={register}
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  requiredMessage="Enter a valid email"
                />
              )}
            />

            <FormField
              name="password"
              label="Password"
              required
              render={({ field }: { field: { id: string; name: string; ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>; "aria-describedby"?: string; "aria-invalid": boolean } }) => (
                <FormInput
                  {...field}
                  register={register}
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  requiredMessage="Password is required"
                />
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}