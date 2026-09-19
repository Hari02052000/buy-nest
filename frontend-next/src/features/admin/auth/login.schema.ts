import { z } from "zod";

/**
 * Login form validation schema.
 * Validates email and password fields for admin authentication.
 * Email is normalized (trim + lowercase) before validation.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .transform((val) => val.trim().toLowerCase())
    .pipe(z.string().min(1, "Email is required").email("Please enter a valid email address")),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;