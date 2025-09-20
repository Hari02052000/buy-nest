import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
} from '@mui/material';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from '../../services/stripe.service'; 

function StripePaymentForm({ clientSecret, onSuccess, onError, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    
    const billingDetails = {
      name: "Customer Name",   
      email: "customer@example.com", 
      address: {
        line1: "123 Main St",
        city: "Mumbai",
        state: "MH",
        postal_code: "400001",
        country: "IN",
      },
    };


    const cardElement = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: billingDetails,
      },
    });

    setLoading(false);

    if (result.error) {
      onError(result.error);
    } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      onSuccess(result.paymentIntent.id);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: 2,
          padding: 2,
          marginBottom: 2,
          backgroundColor: '#fff',
        }}
      >
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
                fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                padding: '10px 14px',
              },
              invalid: { color: '#9e2146' },
            },
          }}
        />
      </Box>

      <DialogActions sx={{ px: 0 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={!stripe || loading}>
          {loading ? "Processing…" : "Pay"}
        </Button>
      </DialogActions>
    </form>
  );
}

export default function PaymentModal({ open, onClose, clientSecret, onSuccess, onError }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Complete Your Payment</DialogTitle>
      <DialogContent>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripePaymentForm
            clientSecret={clientSecret}
            onSuccess={onSuccess}
            onError={onError}
            onClose={onClose}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}
