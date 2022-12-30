/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import Feed from '../components/Feed';
import Slider from 'react-slick';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
function Home() {
  const feed1 = {
    avatar: {
      name: 'JsChad',
      src: '/images/Card/avatar1.png',
    },
    feeds: [
      {
        src: '/images/Card/dog3.png',
      },
      {
        src: '/images/Card/dog4.png',
      },
      {
        src: '/images/Card/dog5.png',
      },
      {
        src: '/images/Card/dog6.png',
      },
      {
        src: '/images/Card/dog7.png',
      },
      {
        src: '/images/Card/dog8.png',
      },
      {
        src: '/images/Card/dog9.png',
      },
      {
        src: '/images/Card/dog10.png',
      },
      {
        src: '/images/Card/dog11.png',
      },
      {
        src: '/images/Card/dog12.png',
      },
      {
        src: '/images/Card/dog13.png',
      },
      {
        src: '/images/Card/dog14.png',
      },
      {
        src: '/images/Card/dog.png',
      },
    ],
  };
  const feed2 = {
    avatar: {
      name: 'SlimLiam',
      src: '/images/Card/avatar2.png',
    },
    feeds: [
      {
        src: '/images/Card/dog12.png',
      },
      {
        src: '/images/Card/dog13.png',
      },
      {
        src: '/images/Card/dog14.png',
      },
      {
        src: '/images/Card/dog14.png',
      },
      {
        src: '/images/Card/dog14.png',
      },
      {
        src: '/images/Card/dog14.png',
      },
      {
        src: '/images/Card/dog14.png',
      },
      {
        src: '/images/Card/dog14.png',
      },
      {
        src: '/images/Card/dog14.png',
      },
      {
        src: '/images/Card/dog14.png',
      },
      {
        src: '/images/Card/dog14.png',
      },
      {
        src: '/images/Card/dog14.png',
      },
      {
        src: '/images/Card/dog14.png',
      },
      {
        src: '/images/Card/dog15.png',
      },
      {
        src: '/images/Card/dog16.png',
      },
      {
        src: '/images/Card/dog16.png',
      },
      {
        src: '/images/Card/dog17.png',
      },
      {
        src: '/images/Card/dog18.png',
      },
    ],
  };
  return (
    <div className=" py-[25px]">
      <section className="mt-10 md:pl-[68px] pl-8 md:pr-[46px] space-y-5">
        <div className="flex justify-between md:pr-[178px] items-center pr-8">
          <h1 className="md:text-[32px] md:leading-[39px] text-[24px] leading-[24px] font-semibold">
            Live Generation Feed
          </h1>
          <Link
            href="/"
            className="text-[16px] leading-[20px] font-medium text-[#B87FD9]"
          >
            All Creators
          </Link>
        </div>
        <div className="space-y-8">
          <Feed feeds={feed1} />
          <Feed feeds={feed2} />
          <Feed feeds={feed2} />
          <Feed feeds={feed2} />
        </div>
      </section>
    </div>
  );
}
export default Home;
