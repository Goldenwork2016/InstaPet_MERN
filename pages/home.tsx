/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Card from '../components/card/card';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';

import { InferGetServerSidePropsType } from 'next';
import { ClickOutside } from '@jyoketsu/click-outside-react';
import {
  generate_character,
  generate_from_ai,
  get_image_detail,
  get_our_picks,
  get_session_images,
  search_tag_upload,
  toggle_favorites,
} from '../apis';
import { AxiosResponse } from 'axios';
import HeartIcon from '../assets/Icons/Heart';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/appContext';
import { normalize_email } from './portal';
import AddCard from '../components/card/addCard';
import Image from 'next/image';
import FavoriteFeed from '../components/FavoriteFeed';
import OurPickFeed from '../components/OurPickFeed';
import { safeWindow } from '../lib/window';
import { base64toFile } from '../helpers/helper';
import { useInView } from 'react-hook-inview';

export type uploadedImageTypes = {
  secure_url: string;
  public_id: string;
}[];
type generateImageType = {
  id?: string;
  userId: string;
  model_name: string;
  style_name: string;
  isFavorite?: boolean;
  image_url: string;
};
function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { push } = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      push('/login');
    },
  });

  const user_id = session?.user?.id;
  // console.log(user_id);
  const [favoriteImages, setFavoriteImages] = useState<
    { src: string; name?: string; public_id: string; url?: string }[]
  >([]);
  const [ourPickImages, setOurPickImages] = useState<
    { src: string; name?: string; public_id: string }[]
  >([]);

  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [clickDog, setClickDog] = useState<generateImageType>({
    image_url: '',
    isFavorite: false,
    model_name: '',
    style_name: '',
    userId: user_id!,
  });

  const [selectedCardModel, setSelectedCardModel] = useState<{
    [key: string]: string;
  }>({});

  const [uploadingItem, setUploadingItem] = useState<generateImageType[]>([]);
  const interval_timeout = (
    time: number,
    data: any,
    model_name: string,
    style_name: string
  ) => {
    setTimeout(async () => {
      const d = await search_tag_upload({ tag: data.tag });
      // console.log(d.data);
      const { resources } = d.data;

      if (d?.data.total_count >= 4) {
        getGeneratedImages();
        setUploadingItem([]);
        setIsGenerating(false);
        return d;
      } else {
        setUploadingItem(
          resources.map((item: any) => ({
            userId: user_id!,
            model_name: model_name,
            style_name: style_name,
            is_favorite: false,
            image_url: item.secure_url,
          }))
        );
        interval_timeout(time + 1000, data, model_name, style_name);
      }
    }, time);
  };

  const getUsers = useCallback(
    async function () {
      if (!user_id) return;
      setIsGenerating(true);

      // favorite
      const favorite_tag = `${username}_favorites`;
      const { data: favs } = (await search_tag_upload({
        tag: favorite_tag,
      })) as AxiosResponse;
      if (favs?.resources) {
        const h = [];
        const hg = favs.resources;
        for (let i = 0; i < hg.length; i++) {
          const { data: fDetail } = await get_image_detail({
            public_id: hg[i].public_id,
          });
          h.push({
            ...fDetail,
            style_name: fDetail?.metadata?.style,
          });
        }
        setFavoriteImages(h);
      }

      const { data: SearchRes } = (await search_tag_upload({
        tag: username,
      })) as AxiosResponse;
      const l = SearchRes.resources;
      const sortList = l.sort((a: any, b: any) => {
        return b.created_at - a.created_at;
      });
      setNextCursor(SearchRes.next_cursor);
      setHasMore(SearchRes.next_cursor ? true : false);
      setGeneratedImages(sortList);
      setIsGenerating(false);
    },
    [user_id]
  );
  const update_favorite = async ({ tag }: { tag: string }) => {
    for (let i = 0; i < 3; i++) {
      setTimeout(async () => {
        const { data: favs } = (await search_tag_upload({
          tag,
        })) as AxiosResponse;
        if (favs?.resources) {
          const h = [];
          const hg = favs.resources;
          for (let i = 0; i < hg.length; i++) {
            const { data: fDetail } = await get_image_detail({
              public_id: hg[i].public_id,
            });
            h.push({
              ...fDetail,
              style_name: fDetail?.metadata?.style,
            });
          }
          setFavoriteImages(h);
        }
      }, 500 * (i + 1));
    }
  };
  const user_instance = session?.user?.email || session?.user?.name;

  const username = normalize_email(user_instance);
  const getGeneratedImages = async () => {
    const { data } = (await search_tag_upload({
      tag: username,
    })) as AxiosResponse;
    if (data) {
      const f = data.resources;
      const sortedF = f.sort((a: any, b: any) => {
        return b.created_at - a.created_at;
      });
      setNextCursor(data.next_cursor);
      setHasMore(data.next_cursor ? true : false);
      setGeneratedImages(sortedF);
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);
  useEffect(() => {
    (async function () {
      if (username) {
        const { data } = (await generate_character({
          userid: username,
          key: '12345_unused',
        })) as AxiosResponse;

        if (data?.success != 0) {
          data.reverse();
          setCharacterList(data);
        } else {
          setCharacterList([]);
          // toast.error('Something went wrong while fetching models');
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      const { data: ourPickData } = (await get_our_picks()) as AxiosResponse;
      if (ourPickData?.success != 0) {
        if (ourPickData?.data) {
          const d = ourPickData.data.map((item: any) => ({
            ...item,
            url: item.image_url,
            name: item.style_name,
          }));
          d.reverse();
          setOurPickImages(d);
        }
      } else {
        setOurPickImages([]);
        toast.error('Something went wrong while fetching our picks');
      }
    })();
  }, []);
  const [selectedCard, setSelectedCard] = useState<{
    id: string;
    src: string;
    name: string;
    style_name: string;
  }>({
    id: '',
    src: '',
    name: '',
    style_name: '',
  });
  const { state, setState } = useAppContext();
  const { isGenerating, isTraining } = state;

  const setIsGenerating = (value: boolean) => {
    setState({ ...state, isGenerating: value });
  };
  const handleGenerate = async ({
    model_name,
    style_name,
  }: {
    model_name: string;
    style_name: string;
  }) => {
    setIsGenerating(true);

    const { data } = (await generate_from_ai({
      user: user_id!,
      model_name,
      style_name,
      image_url: '',
      username,
    })) as AxiosResponse;
    if (data?.success != 0) {
      interval_timeout(20000, data, model_name, style_name);
    } else {
      toast.error('Something went wrong while generating image');
      setIsGenerating(false);
    }
    // getUsers();
  };
  const handleFavorite = async (data: {
    public_id: string;
    isFavorite: boolean;
  }) => {
    try {
      const { public_id } = data;
      const tag = `${username}_favorites`;
      await toggle_favorites({
        tag,
        public_ids: [public_id],
        isFavorite: data.isFavorite,
      });
      update_favorite({ tag });
      setModalOpen(false);
    } catch (e) {
      console.log(e);
    }
  };
  const [images, setImages] = useState<File[]>([]);
  // console.log({ isGenerating });

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      setUploadModalOpen(false);
      if (files.length < 6) return setErrorModalOpen(true);
    }
  };

  const [characterList, setCharacterList] = useState<
    {
      image_url: string;
      public_url: string;
      model_name: string;
      status: number;
    }[]
  >([]);
  const [input, setInput] = useState({
    name: '',
    breed: '',
    species: '',
  });
  const [isVerifyTraining, setIsVerifyTraining] = useState(false);
  const [isToastPayment, setIsToastPayment] = useState(false);
  const [loadingGenerateImage, setLoadingGenerateImage] = useState(false);
  const [nextCursor, setNextCursor] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const handleMoreGeneratedImages = async () => {
    setLoadingGenerateImage(true);
    const { data } = (await search_tag_upload({
      tag: username,
      next_cursor: nextCursor,
    })) as AxiosResponse;
    if (data) {
      const f = data.resources;
      const sortedF = f.sort((a: any, b: any) => {
        return b.created_at - a.created_at;
      });
      setNextCursor(data.next_cursor);
      setHasMore(data.next_cursor ? true : false);
      setGeneratedImages((prev) => [...prev, ...sortedF]);
      setLoadingGenerateImage(false);
    }
  };
  useEffect(() => {
    const sessionInput = JSON.parse(
      safeWindow(() => window.sessionStorage.getItem('input')) || '{}'
    ) as { name: string; breed: string; species: string };
    if (sessionInput) {
      setInput(sessionInput);
    }
    if (!user_id) return;
    (async function () {
      const { data } = (await get_session_images(user_id)) as AxiosResponse;
      if (data?.success) {
        const base64Images = data?.data?.images_base_64?.map((image: string) =>
          base64toFile(image, `${Math.random()}.png`)
        ) as File[];

        setImages(base64Images);
      }
    })();
  }, []);

  const getCardCharacters = async () => {
    if (username) {
      const { data } = (await generate_character({
        userid: username,
        key: '12345_unused',
      })) as AxiosResponse;

      if (data?.success != 0) {
        data.reverse();
        setCharacterList(data);
      } else {
        toast.error('Something went wrong while fetching models');
      }
    }
  };
  const disabledBtn = !selectedCardModel?.name || !selectedCard?.style_name;
  const altDisableBtn = isGenerating || isTraining;
  return (
    <div className="">
      <section className="mt-10">
        <div className="flex justify-between md:pr-[178px] md:px-[68px] px-8 items-center">
          <h1 className=" text-[25px] leading-[25 px] md:text-[32px] md:leading-[39px]  font-semibold">
            Select a model, or create a new one:
          </h1>
        </div>
        {/* Cards */}

        <div className="mt-8 pl-5 md:pl-[68px]">
          <div className="flex space-x-10 overflow-x-auto ">
            <AddCard
              setModalOpen={setUploadModalOpen}
              images={images}
              setImages={setImages}
              userId={user_id!}
              getCardCharacters={getCardCharacters}
              characterList={characterList}
              username={normalize_email(user_instance)}
              setVerifyModalOpen={setVerifyModalOpen}
              isVerifyTraining={isVerifyTraining}
              setIsVerifyTraining={setIsVerifyTraining}
              input={input}
              setInput={setInput}
              handleImageUpload={handleImageUpload}
            />
            {characterList.map((c, id) => (
              <Card
                imageSrc={c.image_url}
                chrName={c.model_name}
                status={c.status}
                username={username}
                key={id}
                isGenerateCard
                {...{
                  selectedCard: selectedCardModel,
                  setSelectedCard: setSelectedCardModel,
                  id: id,
                }}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="mt-10 md:pl-[68px] md:pr-[46px] pl-5">
        <div className="flex justify-between items-start flex-col">
          <h1 className="md:text-[32px] md:leading-[39px] text-[24px] leading-[24px] font-semibold">
            Select an image for stylistic inspiration.
          </h1>
        </div>
        <div className="space-y-8 mt-8">
          <OurPickFeed
            feeds={ourPickImages}
            setSelectedCard={setSelectedCard}
            selectedCard={selectedCard}
          />
          <FavoriteFeed
            feeds={favoriteImages}
            setSelectedCard={setSelectedCard}
            selectedCard={selectedCard}
          />
        </div>
      </section>
      <div className="py-[50px] flex justify-between">
        <button
          onClick={() => {
            // setShowGenerate(true);
            handleGenerate({
              model_name: selectedCardModel.name,
              style_name: selectedCard.style_name,
            });
          }}
          disabled={disabledBtn || altDisableBtn}
          className="px-6 py-[6px] flex font-dmSans italic text-sm w-fit rounded-[100px] relative mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(180deg, #B87FD9 0%, #5C4597 100%)',
          }}
        >
          <span>Generate</span>
        </button>
      </div>
      <div>
        <section className="pr-[15px] md:pr-[34px] pl-[16px]">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-[1px]">
            <>
              {isGenerating && (
                <>
                  {uploadingItem.map((ele, i) => {
                    return (
                      <GenerateItem
                        {...{
                          ele,
                          setModalOpen,
                          setClickDog,
                          modalOpen,
                          isFavorite: false,
                          id: i,
                        }}
                        key={i}
                      />
                    );
                  })}
                  {[0, 1, 2, 3].slice(uploadingItem.length).map((ele, i) => {
                    return (
                      <div key={i} className="bg-primary">
                        <div
                          role="status"
                          className="p-4 max-w-full rounded border border-gray-200 shadow animate-pulse md:p-6 dark:border-gray-700"
                        >
                          <div className="flex justify-center items-center mb-4 h-24 md:h-48 bg-gray-300 rounded dark:bg-gray-700">
                            <svg
                              className="w-12 h-12 text-gray-200 dark:text-gray-600"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 640 512"
                            >
                              <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                            </svg>
                          </div>
                          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 md:w-48 mb-4"></div>
                          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
            {generatedImages.map((ele, id) => {
              const isFavorite = !!favoriteImages.find(
                (fav) => fav.public_id === ele.public_id
              );

              return (
                <GenerateItem
                  {...{
                    ele,
                    setModalOpen,
                    setClickDog,
                    modalOpen,
                    isFavorite,
                    id,
                  }}
                  key={id}
                />
              );
            })}
          </div>
          {generatedImages.length > 0 && (
            <div className="flex flex-col pt-4 w-full items-center">
              {hasMore && (
                <div className="flex flex-col items-center space-y-2">
                  <button
                    className="px-4 py-1 w-fit rounded-[10px] bg-secondary"
                    onClick={handleMoreGeneratedImages}
                    disabled={!hasMore || loadingGenerateImage}
                  >
                    {loadingGenerateImage ? 'Loading...' : 'Show More...'}
                  </button>
                </div>
              )}
              <div className="flex justify-center  my-5">
                <div
                  className="bg-[#37394C] p-5 rounded-full w-fit"
                  onClick={() =>
                    !(
                      Object.keys(selectedCardModel).length === 0 ||
                      Object.keys(selectedCard).length === 0 ||
                      isGenerating
                    ) &&
                    handleGenerate({
                      model_name: selectedCardModel.name,
                      style_name: selectedCard.style_name,
                    })
                  }
                >
                  <img
                    src="/Icons/PlusLg.svg"
                    alt=""
                    className="w-[42px] h-[42px]"
                  />
                </div>
              </div>
            </div>
          )}
        </section>
        {modalOpen && (
          <ModalItem
            {...{ setModalOpen, clickDog, handleFavorite, favoriteImages }}
          />
        )}
        {verifyModalOpen && (
          <VerifyModal
            {...{
              input,
              verifyModalOpen,
              setVerifyModalOpen,
              setIsVerifyTraining,
            }}
          />
        )}
        {errorModalOpen && (
          <UploadErrorModal
            {...{
              setErrorModalOpen,
            }}
          />
        )}
        {uploadModalOpen && (
          <UploadModal
            setModalOpen={setUploadModalOpen}
            handleImageUpload={handleImageUpload}
          />
        )}
      </div>
    </div>
  );
}
const UploadErrorModal = ({
  setErrorModalOpen,
}: {
  setErrorModalOpen: (arg: boolean) => void;
}) => {
  return (
    <div className="fixed inset-0 bg-[#242636A6] z-[1000] ">
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <ClickOutside
          onClickOutside={() => {
            setErrorModalOpen(false);
          }}
        >
          <div className="relative bg-primary px-5 py-8 rounded-[20px]">
            <div className="flex justify-center items-center flex-col space-y-10">
              <h1 className="max-w-[40ch]">
                Please upload a minimum of 6, and no more than 40 images. For
                best results we recommend selecting around 15 photographs taken
                in varied settings
              </h1>
              <div className="flex space-x-4 self-end">
                <button
                  className="py-1 px-5 rounded-[10px] font-dmSans  font-bold text-sm  flex justify-center"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(184, 127, 217,  0.1) 0%, rgba(184, 127, 217, .1) 100%)',
                    boxShadow: '0px 0px 24px -1px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(20px)',
                  }}
                  onClick={() => {
                    setErrorModalOpen(false);
                  }}
                >
                  <span>Back</span>
                </button>
              </div>
            </div>
          </div>
        </ClickOutside>
      </div>
    </div>
  );
};
const VerifyModal = ({
  input,
  setVerifyModalOpen,
  setIsVerifyTraining,
}: {
  input: any;
  setVerifyModalOpen: any;
  setIsVerifyTraining: any;
}) => {
  return (
    <div className="fixed inset-0 bg-[#242636A6] z-[1000] ">
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <ClickOutside
          onClickOutside={() => {
            setVerifyModalOpen(false);
          }}
        >
          <div className="relative bg-primary px-5 py-8 rounded-[20px]">
            <div className="flex justify-center items-center flex-col space-y-10">
              <h1 className="max-w-[40ch]">
                Are you sure you want overwrite {input.name}?
              </h1>
              <div className="flex space-x-4 self-end">
                <button
                  className="py-1 px-3 rounded-[10px] font-dmSans  font-bold text-sm  flex justify-center"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255, 17, 17, 0.1) 0%, rgba(251, 21, 21, 0.1) 100%)',
                    boxShadow: '0px 0px 24px -1px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(20px)',
                  }}
                  onClick={() => {
                    setVerifyModalOpen(false);
                  }}
                >
                  <span>back</span>
                </button>
                <button
                  className="py-1 px-3 rounded-[10px] font-dmSans  font-bold text-sm  flex justify-center"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(184, 127, 217,  0.1) 0%, rgba(184, 127, 217, .1) 100%)',
                    boxShadow: '0px 0px 24px -1px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(20px)',
                  }}
                  onClick={() => {
                    setIsVerifyTraining(true);
                    setVerifyModalOpen(false);
                  }}
                >
                  <span>Yes, I&apos;m sure</span>
                </button>
              </div>
            </div>
          </div>
        </ClickOutside>
      </div>
    </div>
  );
};
const UploadModal = ({
  setModalOpen,
  handleImageUpload,
}: {
  setModalOpen: any;
  handleImageUpload: any;
}) => {
  return (
    <div className="fixed inset-0 bg-[#37394C80] z-[1000] ">
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <ClickOutside
          onClickOutside={() => {
            setModalOpen(false);
          }}
        >
          <div
            className="bg-[#1D1D1D] py-[10px] px-[15px] rounded-[20px] md:w-[500px] mx-4 "
            style={{
              boxShadow: '0px 5px 24px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="flex justify-between relative">
              <img
                src="/images/modal/img1.png"
                alt=""
                className="w-[92px] md:block lg:block hidden"
              />
              <img
                src="/images/modal/img3.png"
                alt=""
                className="w-[246px]  md:block lg:block hidden"
              />
              <img
                src="/images/modal/img2.png"
                alt=""
                className="w-[92px]  md:block lg:block hidden"
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
                  In this stage you are selecting photos that will teach the AI
                  how to create illustrations of your animal kingdom friend.
                  Here are a few tips to help you get the best results:
                </p>
                <ul className="list-disc pl-3 space-y-3">
                  <li>
                    We recommend uploading 20 to 100 photos (more the better!)
                    though some people have had success training on as few as 3
                    images.
                  </li>
                  <li>
                    Select photos that show the animal in a number of positions,
                    settings, poses, and lighting conditions.
                  </li>
                  <li>
                    After upload, each photo will be resized and cropped to a
                    512 pixel square image for training. Make sure your images
                    are at least 512x512 , and no need to send anything in ultri
                    high-res as it will just be downsampled
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
  );
};
const ModalItem = ({
  setModalOpen,
  handleFavorite,
  clickDog,
  favoriteImages,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  clickDog: any;
  handleFavorite: (data: {
    public_id: string;
    isFavorite: boolean;
    url: string;
  }) => void;
  favoriteImages: any[];
}) => {
  const isFavorite = !!favoriteImages.find(
    (fav) => fav.public_id === clickDog.public_id
  );

  return (
    <div className="fixed inset-0 bg-[#242636A6] z-[1000] ">
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <ClickOutside
          onClickOutside={() => {
            setModalOpen(false);
          }}
        >
          <div className="relative md:w-[60vh] md:h-[60vh] w-[95vw] h-[45vh]">
            <div className="absolute inset-0 shadow-2xl"></div>
            <img src={clickDog.secure_url} alt="" className="w-full h-full" />
            <div className="absolute bottom-4 w-full px-3 flex justify-center">
              <div
                className="py-4 w-[273px] rounded-[20px] font-dmSans  font-bold text-sm  flex justify-center"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)',
                  boxShadow: '0px 0px 24px -1px rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="hidden">{clickDog.secure_url}</div>
                <div className="w-full flex justify-between items-center px-6 cursor-pointer">
                  <button>
                    <HeartIcon
                      color="rgb(239 68 68 / 1)"
                      onClick={() =>
                        handleFavorite({
                          public_id: clickDog.public_id,
                          isFavorite: isFavorite,
                          url: clickDog.secure_url,
                        })
                      }
                      filled={isFavorite}
                    />
                  </button>
                  <span>|</span>
                  <button onClick={() => {}}>Share</button>
                  <span>|</span>
                  <button>Upscale</button>
                  <span>|</span>
                  <button>Download</button>
                </div>
              </div>
            </div>
          </div>
        </ClickOutside>
      </div>
    </div>
  );
};
export default Home;

const GenerateItem = ({
  ele,
  setModalOpen,
  setClickDog,
  isFavorite,
  modalOpen,
  id,
}: {
  ele: any;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setClickDog: Dispatch<SetStateAction<generateImageType>>;
  isFavorite: boolean;
  modalOpen: boolean;
  id: number;
}) => {
  const [ref, isVisible] = useInView({
    threshold: 1,
  });
  useEffect(() => {
    if (isVisible) {
      console.log('visible');
    }
    // TODO: add infinite scroll
  }, [isVisible]);
  return (
    <div
      className="relative group"
      ref={id % 50 === 0 ? ref : null}
      onClick={() => {
        setModalOpen(true);
        setClickDog({ ...ele, isFavorite });
      }}
    >
      <img src={ele.image_url || ele.url} alt="" />

      <div className="absolute bottom-4 w-full px-3 group-hover:flex hidden  justify-center">
        {!modalOpen ? (
          <div
            className="py-4 rounded-[20px] font-dmSans  font-bold text-sm w-[273px] flex justify-center"
            style={{
              background:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)',
              boxShadow: '0px 0px 24px -1px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="w-full flex justify-between items-center px-3">
              <button>
                <HeartIcon
                  color="rgb(239 68 68 / 1)"
                  onClick={() => {}}
                  filled={isFavorite!}
                  isPreview
                />
              </button>
              <span>|</span>
              <button>Share</button>
              <span>|</span>
              <button>Upscale</button>
              <span>|</span>
              <button>Download</button>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

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
