"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/form-field";

export interface ProfileFormValues {
  name: string;
  email: string;
  phone?: string;
}

interface ProfileFormProps {
  initialValues?: Partial<ProfileFormValues>;
  onSubmit: (values: ProfileFormValues) => void;
  loading?: boolean;
}

export function ProfileForm({
  initialValues,
  onSubmit,
  loading = false,
}: ProfileFormProps) {
  const [values, setValues] = React.useState<ProfileFormValues>({
    name: initialValues?.name ?? "",
    email: initialValues?.email ?? "",
    phone: initialValues?.phone ?? "",
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof ProfileFormValues, string>>>({});

  const update = (field: keyof ProfileFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof ProfileFormValues, string>> = {};
    if (!values.name.trim()) newErrors.name = "Name is required";
    if (!values.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      newErrors.email = "Invalid email format";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <FormField label="Full Name" htmlFor="name" error={errors.name} required>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="John Doe"
        />
      </FormField>

      <FormField label="Email" htmlFor="email" error={errors.email} required>
        <Input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="john@example.com"
        />
      </FormField>

      <FormField label="Phone (optional)" htmlFor="phone">
        <Input
          id="phone"
          value={values.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="+1 234 567 8900"
        />
      </FormField>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Update Profile"}
      </Button>
    </form>
  );
}