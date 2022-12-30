import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentStatus from '../components/stripe/PaymentStatus';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { safeWindow } from '../lib/window';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as any
);

export default function Thankyou() {
  const {
    query: { payment_intent, payment_intent_client_secret, redirect_status },
    push: pushRouter,
  } = useRouter();
  useEffect(() => {
    if (
      redirect_status === 'succeeded' &&
      payment_intent &&
      payment_intent_client_secret
    ) {
      safeWindow(() => {
        window.sessionStorage.setItem(
          'payment_intent',
          payment_intent as string
        );
        window.sessionStorage.setItem(
          'payment_intent_client_secret',
          payment_intent_client_secret as string
        );
        setTimeout(() => {
          pushRouter('/home');
        }, 500);
      });
    }
  }, [payment_intent, payment_intent_client_secret, redirect_status]);
  return (
    <div className="flex flex-col min-h-screen py-10 lg:px-24 md:px-16 sm:px-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-5">
        Thank you for supporting our site!
      </h1>
      <p className="text-gray-300 mb-3">
        Your purchase includes 200
        one-of-a-kind images of your pet, which will be generated and delivered
        in the moments following checkout.
      </p>
      <p className="text-gray-300 mb-3">
        We stand by our product and guarantee your satisfaction. While some
        images will not resemble your pet, we are confident you will love the
        many original images that do capture what is so special about them. If
        you are not satisfied with your results, we personally help you improve
        the output or offer you a refund.
      </p>
      <p className="text-gray-300 mb-3">
        Unlike most websites, running the Generative AI algorithms used to
        create the artwork requires specialized GPU hardware that is very
        expensive to operate. Your payment allows us to run the website and
        continue to make improvements. Additionally, we will be dedicating 20%
        of proceeds made here to solving the homeless dog crisis in parts of the
        Caribbean. For more information, or to help out please email
      </p>
      <p className="text-gray-300 mb-3">
      <a href="mailto:shelterfund@instapet.art" className="text-secondary ">
          shelterfund@instapet.art
        </a>
      </p>
      <Elements stripe={stripePromise}>
        <PaymentStatus />
      </Elements>
    </div>
  );
}
