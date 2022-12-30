/* eslint-disable @next/next/no-img-element */
import { ClickOutside } from '@jyoketsu/click-outside-react';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, useEffect, useState } from 'react';
import Card from '../components/card/card';
import Feed from '../components/Feed';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';

import AddCard from '../components/card/addCard';
import { InferGetServerSidePropsType } from 'next';
import axios, { AxiosResponse } from 'axios';
import {
  generate_character,
  get_character_list,
  get_username,
  live_feed_generation,
} from '../apis';
export type characterListTypes = {
  id: string;
  breed: string;
  name: string;
  species: string;
  userId: string;
  images: {
    secure_url: string;
    public_id: string;
  }[];
};
export function normalize_email(email: any) {
  if (email?.includes('@')) {
    const split_mail = email.split('@')[0];
    return split_mail;
  } else {
    return email;
  }
}
function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { push } = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      push('/auth/login');
    },
  });

  const user_instance = session?.user?.email || session?.user?.name;
  // console.log('sessin', session);
  const user_id = session?.user?.id;
  console.log('user_id', user_id);

  const [characterList, setCharacterList] = useState<
    {
      image_url: string;
      public_url: string;
      model_name: string;
      status: number;
    }[]
  >([]);
  const [images, setImages] = useState<File[]>([]);
  const [liveFeedGeneration, setLiveFeedGeneration] = useState<any>([]);
  const username = normalize_email(user_instance);
  useEffect(() => {
    (async function () {
      if (user_id) {
        const { data } = (await generate_character({
          userid: username,
          key: '12345_unused',
        })) as AxiosResponse;
        console.log(data);
        data.reverse();
        setCharacterList(data);
        //
        const { data: live_feed_gen } = (await live_feed_generation(
          user_id
        )) as AxiosResponse;
        const arr = Object.values(live_feed_gen.data);
        setLiveFeedGeneration(arr);
      }
    })();
  }, [user_id, username]);
  const getCardCharacters = async () => {
    const { data } = (await generate_character({
      userid: username,
      key: '12345_unused',
    })) as AxiosResponse;
    console.log(data);
    data.reverse();
    setCharacterList(data);
  };
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      console.log({ files });
      setModalOpen(false);
    }
  };

  const [modalOpen, setModalOpen] = useState(false);
  // the images that are uploaded are stored in this state

  const [noLiveFeed, setNoLiveFeed] = useState(false);
  return (
    <div className=" py-[25px]">
      {modalOpen && (
        <div className="fixed inset-0 bg-[#37394C80] z-[1000] ">
          <div className="flex flex-col items-center justify-center h-screen w-full">
            <ClickOutside
              onClickOutside={() => {
                setModalOpen(false);
              }}
            >
              <div
                className="bg-[#1D1D1D] py-[10px] px-[15px] rounded-[20px] w-[500px]"
                style={{
                  boxShadow: '0px 5px 24px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div className="flex justify-between relative">
                  <img
                    src="/images/modal/img1.png"
                    alt=""
                    className="w-[92px]"
                  />
                  <img
                    src="/images/modal/img3.png"
                    alt=""
                    className="w-[246px]"
                  />
                  <img
                    src="/images/modal/img2.png"
                    alt=""
                    className="w-[92px]"
                  />
                </div>
                <div className="-translate-y-[40px]">
                  <div className="w-full flex justify-center ">
                    <div className="">
                      <Image
                        src="/images/modal/avatar.png"
                        width={80}
                        height={80}
                        alt=""
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h1 className="font-semibold text-[20px] leading-[24px]">
                        AI Pro Tip
                      </h1>
                      <Image
                        src="/Icons/Verify.svg"
                        width={18}
                        height={18}
                        alt=""
                      />
                    </div>
                    <p className="text-[14px] leading-[17px] text-[#DDDDDD] mt-[10px]">
                      From the MainCharacter Team
                    </p>
                  </div>
                  <div className="text-[#DDDDDD] text-[12px] leading-[22px] font-normal">
                    <p className="my-3">
                      In this stage you are selecting photos that will teach the
                      AI how to create illustrations of your animal kingdom
                      friend. Here are a few tips to help you get the best
                      results:
                    </p>
                    <ul className="list-disc pl-3 space-y-3">
                      <li>
                        We recommend uploading 20 to 100 photos (more the
                        better!) though some people have had success training on
                        as few as 3 images.
                      </li>
                      <li>
                        Select photos that show the animal in a number of
                        positions, settings, poses, and lighting conditions.
                      </li>
                      <li>
                        After upload, each photo will be resized and cropped to
                        a 512 pixel square image for training. Make sure your
                        images are at least 512x512 , and no need to send
                        anything in ultri high-res as it will just be
                        downsampled
                      </li>
                    </ul>
                    <div className="flex justify-center mt-4">
                      <button
                        className="px-6 py-[6px] flex font-dmSans italic text-sm w-fit rounded-[100px] relative"
                        style={{
                          background:
                            'linear-gradient(180deg, #B87FD9 0%, #5C4597 100%)',
                        }}
                      >
                        <span>Select Photos</span>
                        <input
                          type="file"
                          multiple
                          name=""
                          id=""
                          className="absolute bg-transparent inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleImageUpload}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </ClickOutside>
          </div>
        </div>
      )}
      {/* Top Section */}
      <section className="md:pl-[65px] md:pr-[72px] px-5 space-y-5 md:space-y-0 flex md:flex-row flex-col justify-between">
        <div className="space-y-4">
          <h1 className="text-[32px] leading-[39px] font-semibold">
            Welcome, {normalize_email(user_instance)}
          </h1>
          <div className="flex space-x-4 items-center">
            <Image src="/images/avatar.png" width={30} height={30} alt="" />
            <p className="text-[14px] leading-[17px] font-normal">
              Finish your profile
            </p>
            <Link
              href="/"
              className="text-[16px] leading-[20px] font-medium text-[#B87FD9]"
            >
              Edit Now
            </Link>
          </div>
        </div>
        <div
          className="bg-[#37394C] rounded-[15px] flex items-center py-3 px-8 space-x-10"
          style={{
            boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className="flex flex-col items-center">
            <p className="text-[12px] leading-[14px] font-medium mb-[5px]">
              Credits
            </p>
            <h1 className="text-[32px] leading-[36px] font-semibold mb-[10px]">
              22
            </h1>
            <div className="bg-secondary p-[5px] rounded-full w-fit">
              <Image src="/Icons/Swap.svg" width={14} height={14} alt="" />
            </div>
          </div>
          <div className="text-[16px] leading-[20px] font-normal">
            <h2 className="font-semibold">
              You are subscribed to Creator{' '}
              <span className="text-[#FFA552]">Pro+ </span>
            </h2>
            <ul>
              <li>-3 free character trainings per month</li>
              <li>-Unlimited free generations</li>
              <li>-10% off all physical products</li>
              <li className="text-[#FFA552]">
                -Coming soon : multi-character generations
              </li>
            </ul>
          </div>
          <div className="w-[80px] h-[80px] rounded-full border-[1px] border-[#EEEEEE] md:flex justify-center items-center flex-col space-y-[10px] hidden">
            <div className="p-[7px] bg-[#5AE6BC] w-fit rounded-full">
              <Image src="/Icons/Plus.svg" width={7} height={7} alt="" />
            </div>
            <h3>Top Up </h3>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <div className="flex justify-between md:pr-[178px] md:px-[68px] px-8 items-center">
          <h1 className="text-[32px] leading-[39px] font-semibold">
            My Characters
          </h1>
          <Link
            href="/"
            className="text-[16px] leading-[20px] font-medium text-[#B87FD9]"
          >
            View Gallery
          </Link>
        </div>
        {/* Cards */}
        <div className="mt-8 pl-5 md:pl-[68px]">
          <div className="flex space-x-10 overflow-x-auto ">
            <AddCard
              setModalOpen={setModalOpen}
              images={images}
              setImages={setImages}
              userId={user_id!}
              getCardCharacters={getCardCharacters}
              username={normalize_email(user_instance)}
            />
            {characterList.map((c, id) => (
              <Card
                imageSrc={c.image_url}
                chrName={c.model_name}
                status={c.status}
                username={username}
                key={id}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="mt-10 md:pl-[68px] md:pr-[46px] pl-8">
        <div className="flex justify-between md:pr-[178px] items-center">
          <h1 className="md:text-[32px] md:leading-[39px] text-[24px] leading-[24px] font-semibold">
            Live Generation Feed
          </h1>
          <Link
            href="/feeds"
            className="text-[16px] leading-[20px] font-medium text-[#B87FD9] pr-8"
          >
            All Creators
          </Link>
        </div>
        <div className="space-y-8 mt-8">
          {liveFeedGeneration.map((feed: characterListTypes[], id: number) => {
            return (
              <Feed
                key={id}
                feeds={{
                  feeds: feed.map((item) => ({
                    src:
                      item.images?.[0]?.secure_url ||
                      '/images/Card/avatar1.png',
                    name: item.name,
                  })),
                  avatar: {
                    name: '',
                    src: '/images/Card/avatar1.png' || '',
                  },
                }}
                liveGenerateData={feed}
                setNoLiveFeed={setNoLiveFeed}
              />
            );
          })}
          <>
            {noLiveFeed && (
              <div className="flex justify-center items-center">
                <h1 className="text-[32px] leading-[39px] font-semibold my-8">
                  {/* No Live Feed */}
                </h1>
              </div>
            )}
          </>
        </div>
      </section>
    </div>
  );
}
export default Home;

export const getServerSideProps = async (ctx: any) => {
  const session = await getSession(ctx);

  if (!session)
    return {
      redirect: {
        destination: '/login',
      },
    };

  return {
    props: { session },
  };
};
