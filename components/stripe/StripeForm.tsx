import {
  PaymentElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement
} from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";

interface ICheckoutFormProps {
  ammount: number;
  setAmmount: (ammount: number) => void;
}

export default function StripeForm({ammount , setAmmount}: ICheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<String | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [paymentRequest, setPaymentRequest] = useState(null);

  const paymentElementOptions = {
    layout: "tabs",
  };

  // this is for the payment request button AKA: Apple Pay, Google Pay, etc.
  useEffect(() => {
    if (stripe) {
      const pr: any = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'IA Model Train',
          amount: ammount

        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      // Check the availability of the Payment Request API.
      pr.canMakePayment().then((result: PaymentRequest) => {
        if (result) {
          setPaymentRequest(pr);
        }
      }).catch((err: any) => {
        console.log(err, 'err')
      });
    }
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error }: any = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: window.location.origin + "/thank-you",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="w-full">

      {/* Payment Request Button Element */}
      {paymentRequest ? (
        <div className="mb-4">
          <PaymentRequestButtonElement className="mb-2" options={{paymentRequest}} />
          <h4 className="text-center text-gray-500 text-xs mb-4">Or</h4>
        </div>
      ) : null}

      {/* Card Element */}
      <PaymentElement id="payment-element" />
      <button
        className="mt-8 border border-transparent hover:border-gray-300 dark:bg-white dark:hover:bg-gray-900 dark:text-gray-900 dark:hover:text-white dark:border-transparent bg-gray-900 hover:bg-white text-white hover:text-gray-900 flex justify-center items-center py-4 rounded w-full"
        disabled={isLoading as boolean || !stripe as boolean || !elements as boolean}
        id="submit"
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : ` Pay $${ammount}`}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
