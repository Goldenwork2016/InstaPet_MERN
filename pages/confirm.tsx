import Image from 'next/image';
import React from 'react';

const Confirm = (props: any) => {
  return (
    <>
      <div className="bg-[#1E1E2C] min-h-screen w-full flex justify-center text-white py-12 text-center">
        <div className="flex flex-col items-center">
          <div className="flex space-x-6 items-center mx-auto justify-center">
            <Image
              src="/logo.png"
              width={84}
              height={87}
              className="rounded-full"
              alt=""
            />
            <h1 className="md:text-[32px] text-[20px] mx-4  leading-[12px] font-bold tracking-[-.01em]">
              InstaPet.art
            </h1>
          </div>
          <div
            className="bg-[#1D1D1D] py-[52px] rounded-[20px] font-dmMono font-medium flex flex-col space-y-6 px-[52px] items-center mt-[52px] justify-between w-4/5"
            style={{
              boxShadow: '0px 5px 24px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="space-y-5 w-1/2">
              <h2 className="text-[36px] leading-[22px] text-center ">LOGIN</h2>
              <div className=" h-[1px] bg-white"></div>
            </div>
            <div className="space-y-8 flex justify-center flex-col items-center">
              <Image src="/Icons/sendIcon.svg" width={39} height={39} alt="" />
              <p className="max-w-[40ch] text-[16px] leading-[22px] text-center">
                Check your email!
              </p>
              <p> A sign-in link has been sent to your mail</p>
            </div>
            <div>
              <p className="max-w-[60ch] text-[16px] leading-[22px] text-center">
                Can&apos;t find the email? Wait a sec, check your spam &
                promotions folders, or message us for additional support:
                wtf@InstaPet.art
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Confirm;
