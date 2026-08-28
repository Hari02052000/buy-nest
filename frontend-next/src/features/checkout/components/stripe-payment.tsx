"use client";

import * as React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { STRIPE_PUBLISHABLE_KEY } from "@/lib/constants";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface StripePaymentProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
}

function PaymentForm({
  onSuccess,
  onError,
  disabled,
}: {
  onSuccess: (paymentIntentId: string) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    setProcessing(false);

    if (error) {
      onError?.(error.message ?? "Payment failed");
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" className="w-full" disabled={!stripe || processing || disabled}>
        {processing ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
}

export function StripePayment({
  clientSecret,
  onSuccess,
  onError,
  disabled,
}: StripePaymentProps) {
  const options = React.useMemo(
    () => ({
      clientSecret,
      appearance: { theme: "stripe" as const },
    }),
    [clientSecret]
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm onSuccess={onSuccess} onError={onError} disabled={disabled} />
    </Elements>
  );
}