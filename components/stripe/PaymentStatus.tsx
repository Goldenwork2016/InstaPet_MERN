import { useState, useEffect } from "react";
import { useStripe } from "@stripe/react-stripe-js";

export default function PaymentStatus() {
  const stripe = useStripe();
  const [message, setMessage] = useState("");
  const stylesForStatus: { [key: string]: string } = {
    'Payment succeeded!': "text-green-500",
    'Your payment is processing.': "text-yellow-500",
    'Your payment was not successful, please try again.': "text-red-500",
    'Something went wrong.': "text-red-500",
    '': "text-gray-500",
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      setMessage("Something went wrong");
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }: any) => {
        switch (paymentIntent.status) {
          case "succeeded":
            setMessage("Payment succeeded!");
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
      });
  }, [stripe]);

  return <p className={stylesForStatus[message]}>{message}</p>;
}
