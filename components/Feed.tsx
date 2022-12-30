/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
// * eslint - disable @next/next/no - img - element * /
import classNames from 'classnames';
import Image from 'next/image';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { ClickOutside } from '@jyoketsu/click-outside-react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
// import { Virtual } from 'swiper';

import { Transition } from '@headlessui/react';
import { characterListTypes } from '../pages/portal';
import { get_username, search_tag_upload } from '../apis';
import { AxiosResponse } from 'axios';
type h = characterListTypes & {
  user_id: string;
};
const Feed = ({
  feeds,
  isGenerate,
  empty_meessage,
  selectedCard,
  setSelectedCard,
  isDoubled,
  liveGenerateData,
  setNoLiveFeed,
  isFavorite,
}: {
  isDoubled?: boolean;
  isFavorite?: boolean;
  feeds: {
    feeds: {
      src: string;
      name?: string;
      id?: string | number;
    }[];
    avatar: {
      name: string;
      src: string;
    };
  };
  setNoLiveFeed?: any;
  isGenerate?: boolean;
  liveGenerateData?: characterListTypes[];
  empty_meessage?: string;
  setSelectedCard?: any;
  selectedCard?: any;
}) => {
  // get the width of the div
  const [openCarousel, setOpenCarousel] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const [username, setUsername] = useState(feeds.avatar.name);
  const [avatar, setAvatar] = useState(feeds.avatar.src);
  const [data, setData] = useState<any>([]);
  const feedArr = liveGenerateData?.length ? data : feeds.feeds;
  useEffect(() => {
    (async function () {
      if (liveGenerateData && liveGenerateData?.length > 0) {
        const user_id = liveGenerateData[0].userId;
        const { data } = (await get_username(user_id)) as any;
        if (data?.data) {
          setUsername(data?.data?.username);
          if (data?.data?.details?.image) {
            setAvatar(data?.data?.details?.image);
          }
          if (data?.data?.username) {
            const { data: SearchRes } = (await search_tag_upload({
              tag: data?.data?.username,
            })) as AxiosResponse;
            const l = SearchRes.resources.map((item: any) => ({
              ...item,
              src: item.url,
            }));
            if (l.length < 1) {
              setNoLiveFeed(true);
            }
            setData(l);
          }
        }
      }
    })();
  }, [liveGenerateData, liveGenerateData?.length, username]);
  return (
    <ClickOutside
      onClickOutside={() => {
        setOpenCarousel(false);
      }}
      style={{ width: '100%', height: '100%' }}
    >
      {feedArr.length > 0 || isGenerate ? (
        <div
          className="bg-[#343646] px-3 py-4 rounded-[15px] w-full space-y-4"
          style={{
            boxShadow: '0px 5px 24px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            className="w-full grid grid-cols-[120px,minmax(1000px,1fr)] overflow-x-hidden"
            style={{
              boxShadow: '0px 5px 24px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="flex flex-col justify-center items-center space-y-[6px]">
              {avatar && (
                <Image
                  src={avatar}
                  width={false ? 24 : 48}
                  height={false ? 24 : 48}
                  alt=""
                  className="rounded-full"
                />
              )}
              <p className="font-semibold w-1/2 md:w-full md:text-[15px] text-[12px] leading-[14px]  md:leading-[18px] text-center">
                {username}
              </p>
            </div>
            <div className="relative w-full">
              {!openCarousel ? (
                <div className="flex space-x-4 overflow-x-auto h-full items-center">
                  {feedArr.length > 0 ? (
                    feedArr.map((feed: any, key: number) => {
                      const isSelected = isFavorite
                        ? false
                        : selectedCard?.id == feed.id;
                      return (
                        <div
                          onClick={() => {
                            if (!isGenerate) {
                              setOpenCarousel(true);
                              setInitialSlide(key);
                            } else {
                              if (isSelected) {
                                setSelectedCard({});
                              } else {
                                setSelectedCard({ ...feed });
                              }
                            }
                          }}
                          className={classNames(
                            'w-fit h-full relative  rounded-[10px] p-[5px]',
                            {
                              'bg-[#5C4597]': isGenerate ? isSelected : false,
                            }
                          )}
                          key={key}
                        >
                          <img
                            src={feed.src || feed.url}
                            className="h-[80px] min-w-[100px] w-[100px] rounded-[10px] object-cover"
                            alt=""
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex mx-auto h-[80px] items-center  ">
                      {empty_meessage}
                    </div>
                  )}
                </div>
              ) : (
                <Swiper
                  spaceBetween={20}
                  slidesPerView={11}
                  centeredSlides={true}
                  onSwiper={(swiper) => {}}
                  roundLengths={true}
                  loop={true}
                  preventClicks={false}
                  initialSlide={initialSlide}
                  slideToClickedSlide={true}
                >
                  {feedArr.map((feed: any, key: number) => (
                    <SwiperSlide
                      key={key}
                      virtualIndex={key}
                      className="relative"
                    >
                      {({ isActive }) => {
                        return isActive ? (
                          <Transition
                            enter="ease-in-out duration-800"
                            enterFrom="opacity-0 scale-25"
                            enterTo="opacity-100 scale-100"
                            leave="ease-out duration-500"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-0"
                            appear
                            show={isActive}
                            as={Fragment}
                          >
                            <div
                              className={classNames(
                                'w-full transition-all duration-300 h-full relative'
                              )}
                              key={key}
                            >
                              <img
                                src={feed.src}
                                className="h-[300px] min-w-[100px] w-full rounded-[20px]"
                                alt=""
                              />
                              <div className="absolute -translate-x-1/2 bottom-8 left-1/2">
                                <div
                                  className="py-4 rounded-[20px] font-dmSans  font-bold text-sm w-full flex justify-center"
                                  style={{
                                    background:
                                      'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)',
                                    boxShadow:
                                      '0px 0px 24px -1px rgba(0, 0, 0, 0.2)',
                                    backdropFilter: 'blur(20px)',
                                  }}
                                >
                                  <div className="w-full flex justify-between items-center px-3 space-x-1">
                                    <button>&lt;3 </button>
                                    <span>|</span>
                                    <button>Share</button>
                                    <span>|</span>
                                    <button>Upscale</button>
                                    <span>|</span>
                                    <button>Download</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Transition>
                        ) : (
                          <Transition
                            enter="ease-out duration-600"
                            enterFrom="opacity-0 scale-25"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-800"
                            leaveFrom="opacity-100 scale-75"
                            leaveTo="opacity-0 scale-0"
                            appear
                            show={!isActive}
                            as={Fragment}
                          >
                            <div
                              className={classNames(
                                'w-full transition-all duration-300 h-full relative'
                              )}
                              key={key}
                            >
                              <img
                                src={feed.src}
                                className="h-[80px] min-w-[100px] w-full rounded-[10px]"
                                alt=""
                              />
                            </div>
                          </Transition>
                        );
                      }}
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>
          {isDoubled && (
            <div className="flex space-x-4 overflow-x-scroll no-scrollbar h-full items-center">
              {feedArr.length > 0 ? (
                feedArr.map((feed: any, key: number) => {
                  const isSelected = selectedCard?.id == feed.id;
                  return (
                    <div
                      onClick={() => {
                        if (!isGenerate) {
                          setOpenCarousel(true);
                          setInitialSlide(key);
                        } else {
                          if (isSelected) {
                            setSelectedCard({});
                          } else {
                            setSelectedCard({ ...feed });
                          }
                        }
                      }}
                      className={classNames(
                        'w-full transition-all duration-300 h-full relative  rounded-[10px]',
                        {
                          'p-[5px] bg-[#5C4597]': isSelected,
                        }
                      )}
                      key={key}
                    >
                      <img
                        src={feed.src}
                        className="h-[80px] min-w-[100px] w-full"
                        alt=""
                      />
                    </div>
                  );
                })
              ) : (
                <div className="flex mx-auto h-[80px] items-center  ">
                  {empty_meessage}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </ClickOutside>
  );
};

export default Feed;
const FeedItem = ({
  feed,
  setOpenCentered,
  openCentered,
  id,
  index,
}: {
  feed: any;
  id: number;
  setOpenCentered: any;
  openCentered: any;
  index: any;
}) => {
  return <div></div>;
};

/*
         

          */
