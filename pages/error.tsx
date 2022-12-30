import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Confirm = (props: any) => {

  return (
    <>
      <div className="bg-[#1E1E2C]  h-screen w-full  flex justify-center text-white py-12 min-h-[521px]">
        <div>
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
            className="bg-[#1D1D1D] py-[52px] rounded-[20px] font-dmMono font-medium flex flex-col space-y-6 mx-[10px] md:px-[52px] items-center mt-[52px] justify-between min-h-[521px]"
            style={{
              boxShadow: '0px 5px 24px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="space-y-5 w-full">
              <h2 className="text-[36px] leading-[22px] text-center ">INVALID LINK</h2>
              <div className="w-1/2 h-[1px] bg-white mx-auto "></div>
            </div>

            <div className="space-y-8 flex justify-center flex-col items-center">
              <Image src="/Icons/Help.svg" width={50} height={50} alt="" />
              <p className="max-w-[40ch] text-[16px] leading-[22px] text-center">
                The login link you have used is no longer active, Please click
                <Link href="/login" className='p-2 underline'>here</Link> to request a new link, or login another way
              </p>
            </div>
            <div>
              <p className="max-w-[60ch] text-[16px] leading-[22px] text-center">
                Having trouble ?
              </p>
              <p className=' text-center'>
                For additional support: wtf@InstaPet.art
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Confirm
