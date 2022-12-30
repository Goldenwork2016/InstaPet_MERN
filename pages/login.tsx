import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import {
  getCsrfToken,
  useSession,
  signIn,
  signOut,
  getSession,
} from 'next-auth/react';
import { useRouter } from 'next/router';
import { InferGetServerSidePropsType } from 'next';

interface FormData {
  email: string;
}

const SignIn = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [email, setEmail] = useState<FormData>({ email: '' });
  const [submitting, setSubmitting] = useState(false);
  const { data: session, status } = useSession();
  const { push } = useRouter();

  console.log(session, status);

  if (status === 'loading')
    return (
      <>
        {' '}
        <div className=" mx-auto my-auto container flex flex-col items-center justify-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          ></div>
          <span className="visually-hidden text-white">Loading...</span>
        </div>
      </>
    );

  const handleOAuthSignIn = (provider: any) => () => signIn(provider);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    if (!email) return false;

    signIn('email', { email, redirect: true, callbackUrl: '/home' });
  };

  return (
    <div className="bg-[#1E1E2C] min-h-screen w-full flex justify-center   text-white py-12 px-4">
      <div>
        <div className="flex space-x-6 items-center justify-center">
          <Image
            src="/logo.png"
            width={84}
            height={87}
            className="rounded-full"
            alt=""
          />
          <h1 className="md:text-[32px] text-[20px] mx-4 leading-[12px] font-bold tracking-[-.01em]">
            InstaPet.art
          </h1>
        </div>


        {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
        <div
          className="bg-[#1D1D1D] py-[52px] rounded-[20px] font-dmMono font-medium flex flex-col min-[280px]:px-[1px] space-y-6 px-[20px] md:px-[52px] items-center mt-[52px] "
          style={{
            boxShadow: '0px 5px 24px rgba(0, 0, 0, 0.1)',
          }}
        >
          <form
            onSubmit={handleSubmit}
          // action="/api/auth/signin/email"
          >
            <div className="space-y-5 flex flex-col gap-2 items-center ">
              <h2 className="text-[28px] leading-[22px] ">LOGIN</h2>
              <div className="w-1/2 h-[1px] bg-white"></div>
            </div>
            <div className="space-y-6 flex flex-col items-center !mt-[40px]">
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="cujo@fourleggedfriend.com"
                className="bg-[#343646] border-none py-2 placeholder:text-[#58596B] 
                placeholder:font-sans px-3 rounded-[12px] md:w-[360px] 
                outline-none focus:outline-none focus:border-none"
                onChange={(e: any) => {
                  setEmail(e.target.value);
                }}
              />
              <button
                className="px-8 py-3 flex text-[16px] leading-[22px] font-normal w-fit rounded-[100px] relative"
                style={{
                  background:
                    'linear-gradient(180deg, #B87FD9 0%, #5C4597 100%)',
                }}
                type="submit"
                disabled={submitting}
              >
                {!submitting ? (
                  <span>Login with Email</span>
                ) : (
                  <span>Sending mail...</span>
                )}
              </button>
            </div>
          </form>
          <div className="flex items-center justify-between w-full !my-[40px]">
            <div className="w-[132px] h-[1px] bg-white"></div>
            <p className="text-[11px] leading-[22px]">or</p>
            <div className="w-[132px] h-[1px] bg-white"></div>
          </div>
          <div className="space-y-5  flex flex-col items-center md:w-full w-[230px]">
            <button key={'instagram'} onClick={handleOAuthSignIn('instagram')}>
              <Image
                src="/images/instagram.png"
                width={287}
                height={39}
                alt=""
              />
            </button>

            <button key={'twitter'} onClick={handleOAuthSignIn('twitter')}>
              <Image src="/images/twitter.png" width={287} height={39} alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

export const getServerSideProps = async (ctx: any) => {
  const session = await getSession(ctx);

  if (session)
    return {
      redirect: {
        destination: '/home',
      },
    };

  return {
    props: { session },
  };
};
