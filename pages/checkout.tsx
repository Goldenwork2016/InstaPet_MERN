import { Elements } from '@stripe/react-stripe-js';
import {
  loadStripe,
  StripeElementsOptions,
  Appearance,
} from '@stripe/stripe-js';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { get_session_images } from '../apis';
import StripeForm from '../components/stripe/StripeForm';
import { tryCatchStandarize, IOptions } from '../helpers/fetch';
import { safeWindow } from '../lib/window';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as any
);

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [ammount, setAmmount] = useState<number>(7);
  const [error, setError] = useState<boolean>(false);
  const threshold = 7;

  useEffect(() => {
    async function createPaymentIntent(amount: number) {
      const [clientSecret, error] = await tryCatchStandarize({
        url: '/api/stripe/payment-intent',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
        }),
      });

      return [clientSecret, error];
    }

    createPaymentIntent(ammount).then((data) => {
      const [stripeData, error] = data;
      if (error) {
        setError(true);
        return;
      }
      setClientSecret(stripeData.clientSecret);
    });
  }, [ammount]);
  const [images, setImages] = useState<string[]>([]);
  const userId = safeWindow(() => window.sessionStorage.getItem('userId'));
  useEffect(() => {
    if (!userId) return;
    (async function () {
      const { data } = (await get_session_images(userId)) as AxiosResponse;
      if (data?.success) {
        setImages(data?.data?.images_base_64);
      }
    })();
  }, [userId]);

  const appearance: Appearance = {
    theme: 'night',
    labels: 'floating',
    variables: {
      colorPrimary: '#b87fd9',
      // colorBackground: '#ffffff',
      // colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '4px',
      // See all possible variables below
    },
  };
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  if (error) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold">Product not found</h1>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    );
  }
  const input = safeWindow(() => window.sessionStorage.getItem('input'));
  const inputParsed = (input ? JSON.parse(input) : null) as {
    name: string;
    breed: string;
    species: string;
  } | null;

  return (
    <section className="flex flex-col items-center justify-center py-4 px-24">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <h3 className="text-2xl self-start font-semibold">Model Details</h3>
      <div className="self-start space-y-2 my-4">
        <div className="flex space-x-4">
          <h4>Model Name :</h4> <p>{inputParsed?.name}</p>
        </div>
        <div className="flex space-x-4">
          <h4>Species :</h4> <p>{inputParsed?.species}</p>
        </div>
        {inputParsed?.breed && (
          <div className="flex space-x-4">
            <h4>Breed :</h4> <p>{inputParsed?.breed}</p>
          </div>
        )}
        <div>
          <h4>Images :</h4>
          <div className="grid grid-cols-4 gap-5">
            {images?.map((image) => (
              <img
                key={image}
                src={image}
                alt="model"
                className="w-full h-[150px] object-cover"
              />
            ))}
          </div>
        </div>
      </div>

      <Elements options={options} stripe={stripePromise}>
        <StripeForm ammount={ammount} setAmmount={setAmmount} />
      </Elements>
    </section>
  );
}
