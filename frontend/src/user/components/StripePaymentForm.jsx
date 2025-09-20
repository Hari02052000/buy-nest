import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

function StripePaymentForm({ clientSecret, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

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

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: billingDetails,
      },
    });

    if (result.error) {
      onError(result.error);
    } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      onSuccess(result.paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {/* Add input fields to collect billing details here */}
      <button type="submit" disabled={!stripe}>Pay</button>
    </form>
  );
}
export default StripePaymentForm