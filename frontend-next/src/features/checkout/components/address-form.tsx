"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/form-field";

export interface AddressFormValues {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  country?: string;
}

interface AddressFormProps {
  initialValues?: Partial<AddressFormValues>;
  onSubmit: (values: AddressFormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export function AddressForm({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = "Save Address",
}: AddressFormProps) {
  const [values, setValues] = React.useState<AddressFormValues>({
    fullName: initialValues?.fullName ?? "",
    addressLine1: initialValues?.addressLine1 ?? "",
    addressLine2: initialValues?.addressLine2 ?? "",
    city: initialValues?.city ?? "",
    state: initialValues?.state ?? "",
    zipCode: initialValues?.zipCode ?? "",
    phone: initialValues?.phone ?? "",
    country: initialValues?.country ?? "",
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof AddressFormValues, string>>>({});

  const update = (field: keyof AddressFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AddressFormValues, string>> = {};
    if (!values.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!values.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!values.city.trim()) newErrors.city = "City is required";
    if (!values.state.trim()) newErrors.state = "State is required";
    if (!values.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    if (!values.phone.trim()) newErrors.phone = "Phone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Full Name" htmlFor="fullName" error={errors.fullName} required>
        <Input
          id="fullName"
          value={values.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          placeholder="John Doe"
        />
      </FormField>

      <FormField label="Address Line 1" htmlFor="addressLine1" error={errors.addressLine1} required>
        <Input
          id="addressLine1"
          value={values.addressLine1}
          onChange={(e) => update("addressLine1", e.target.value)}
          placeholder="123 Main St"
        />
      </FormField>

      <FormField label="Address Line 2 (optional)" htmlFor="addressLine2">
        <Input
          id="addressLine2"
          value={values.addressLine2}
          onChange={(e) => update("addressLine2", e.target.value)}
          placeholder="Apt 4B"
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="City" htmlFor="city" error={errors.city} required>
          <Input
            id="city"
            value={values.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="New York"
          />
        </FormField>

        <FormField label="State" htmlFor="state" error={errors.state} required>
          <Input
            id="state"
            value={values.state}
            onChange={(e) => update("state", e.target.value)}
            placeholder="NY"
          />
        </FormField>

        <FormField label="ZIP Code" htmlFor="zipCode" error={errors.zipCode} required>
          <Input
            id="zipCode"
            value={values.zipCode}
            onChange={(e) => update("zipCode", e.target.value)}
            placeholder="10001"
          />
        </FormField>

        <FormField label="Phone" htmlFor="phone" error={errors.phone} required>
          <Input
            id="phone"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+1 234 567 8900"
          />
        </FormField>
      </div>

      <FormField label="Country (optional)" htmlFor="country">
        <Input
          id="country"
          value={values.country}
          onChange={(e) => update("country", e.target.value)}
          placeholder="USA"
        />
      </FormField>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}