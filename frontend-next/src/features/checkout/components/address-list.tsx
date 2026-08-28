"use client";

import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  country?: string;
}

interface AddressListProps {
  addresses: Address[];
  selectedId?: string;
  onSelect: (addressId: string) => void;
  className?: string;
}

export function AddressList({
  addresses,
  selectedId,
  onSelect,
  className,
}: AddressListProps) {
  if (addresses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        No saved addresses. Please add a new address.
      </p>
    );
  }

  return (
    <RadioGroup
      value={selectedId}
      onValueChange={onSelect}
      className={cn("space-y-3", className)}
    >
      {addresses.map((address) => (
        <div
          key={address.id}
          className={cn(
            "flex items-start gap-3 rounded-lg border p-4 transition-colors",
            selectedId === address.id && "border-primary bg-primary/5"
          )}
        >
          <RadioGroupItem
            value={address.id}
            id={`address-${address.id}`}
            className="mt-1"
          />
          <Label
            htmlFor={`address-${address.id}`}
            className="flex-1 cursor-pointer space-y-1"
          >
            <p className="font-medium">{address.fullName}</p>
            <p className="text-sm text-muted-foreground">
              {address.addressLine1}
            </p>
            <p className="text-sm text-muted-foreground">
              {address.city}, {address.state} {address.zipCode}
            </p>
            <p className="text-sm text-muted-foreground">
              Phone: {address.phone}
            </p>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}