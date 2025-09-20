import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const createPaymentIntent = async (amount, currency = 'usd', token) => {
  try {
//     console.log('stripe');
//     | Field       | Value                 |
// | ----------- | --------------------- |
// | Card Number | `4242 4242 4242 4242` |
// | Expiry      | `12 / 34`             |
// | CVC         | `123`                 |
// | ZIP Code    | `12345`               |

    
    // const response = await fetch('/api/v1/payments/create-payment-intent', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   },
    //   body: JSON.stringify({
    //     amount: Math.round(amount * 100), // Convert to cents
    //     currency
    //   })
    // });
    
    // const data = await response.json();
    
    // if (!data.success) {
    //   throw new Error(data.message || 'Failed to create payment intent');
    // }
    
    // return data.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export default stripePromise;