/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Card from '../components/card/card';
import Feed from '../components/Feed';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';

import { InferGetServerSidePropsType } from 'next';
import { ClickOutside } from '@jyoketsu/click-outside-react';
import {
  generate_character,
  generate_from_ai,
  get_all_favorites,
  get_our_picks,
  get_user_favorites_list,
  save_generate_from_ai,
  search_tag_upload,
  toggle_favorites,
} from '../apis';
import { AxiosResponse } from 'axios';
import HeartIcon from '../assets/Icons/Heart';
import { toast } from 'react-toastify';
import { Image, Shimmer } from 'react-shimmer';
import { useAppContext } from '../context/appContext';
import { normalize_email } from './portal';

export type uploadedImageTypes = {
  secure_url: string;
  public_id: string;
}[];
type generateImageType = {
  id?: string;
  userId: string;
  model_name: string;
  style_name: string;
  is_favorite?: boolean;
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
  console.log(user_id);
  const [favoriteImages, setFavoriteImages] = useState<
    { src: string; name?: string; public_id: string }[]
  >([]);
  const [ourPickImages, setOurPickImages] = useState<
    { src: string; name?: string }[]
  >([]);

  const feed1 = {
    avatar: {
      name: 'Our Picks',
      src: '/Icons/Verify.svg',
    },
    feeds: [
      {
        src: '/images/Card/random.png',
        name: 'random',
        style_name: 'random',
      },
      ...ourPickImages,
    ],
  };
  const feed2 = {
    avatar: {
      name: 'Favorites Collection',
      src: '',
    },
    feeds: [...favoriteImages],
  };
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [clickDog, setClickDog] = useState<generateImageType>({
    image_url: '',
    is_favorite: false,
    model_name: '',
    style_name: '',
    userId: user_id!,
  });

  const [selectedCardModel, setSelectedCardModel] = useState<{
    [key: string]: string;
  }>({});

  const [characters, setCharacters] = useState<
    { id?: string; model_name: string; public_id: string; image_url: string }[]
  >([]);
  // console.log(generatedImages);
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
      async function save(image_url: string) {
        await save_generate_from_ai({
          user: user_id!,
          model_name,
          style_name,
          image_url: image_url,
        });
        console.log('Saved to DB');
      }
      if (d?.data.total_cnount == 4) {
        resources.map(async (item: any) => {
          await save(item.secure_url);
        });
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
  const { state, setState } = useAppContext();
  const { isGenerating } = state;
  const setIsGenerating = useCallback(
    (value: boolean) => {
      setState({ ...state, isGenerating: value });
    },
    [setState, state]
  );
  const user_instance = session?.user?.email || session?.user?.name;

  const username = normalize_email(user_instance);

  const getUsers = useCallback(
    async function () {
      if (!user_id) return;
      setIsGenerating(true);

      const { data } = (await get_user_favorites_list(
        user_id
      )) as AxiosResponse;

      const { data: SearchRes } = (await search_tag_upload({
        tag: username,
      })) as AxiosResponse;

      if (data) {
        const favs = (await get_all_favorites({
          user_id: user_id,
        })) as AxiosResponse;
        if (favs?.data?.data) {
          // console.log(k.data);
          const hg = favs?.data?.data.map((item: any) => ({
            ...item,
            src: item.url,
          }));

          const sorted_favorites = hg.sort(
            (a: any, b: any) =>
              new Date(b.favorite_time).valueOf() -
              new Date(a.favorite_time).valueOf()
          );

          setFavoriteImages(sorted_favorites);
        }
        const l = SearchRes.resources.map((item: any) => ({
          ...item,
        }));

        setGeneratedImages(l);
        setIsGenerating(false);
      }
    },
    [setIsGenerating, user_id, username]
  );
  const update_favorite = async () => {
    const { data } = (await get_user_favorites_list(user_id!)) as AxiosResponse;

    const { data: SearchRes } = (await search_tag_upload({
      tag: username,
    })) as AxiosResponse;
    if (data) {
      const { data: k } = (await get_all_favorites({
        user_id: user_id!,
      })) as AxiosResponse;
      if (k?.data) {
        console.log(k.data);
        const hg = k.data.map((item: any) => ({
          ...item,
          src: item.url,
        }));
        const sorted_favorites = hg.sort(
          (a: any, b: any) =>
            new Date(b.favorite_time).valueOf() -
            new Date(a.favorite_time).valueOf()
        );
        setFavoriteImages(sorted_favorites);
      }
      const l = SearchRes.resources.map((item: any) => ({
        ...item,
      }));

      setGeneratedImages(l);
    }
  };

  const getGeneratedImages = async () => {
    const { data } = (await search_tag_upload({
      tag: username,
    })) as AxiosResponse;
    if (data) {
      const f = data.data.map((item: any) => ({
        ...item,
        url: item.image_url,
      }));

      f.reverse();

      setGeneratedImages(f);
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
        if (data) {
          data.reverse();
          setCharacters(data);
        }
      }
      const { data: ourPickData } = (await get_our_picks()) as AxiosResponse;
      if (ourPickData?.data) {
        const d = ourPickData.data.map((item: any) => ({
          ...item,
          src: item.image_url,
          name: item.style_name,
        }));
        d.reverse();
        setOurPickImages(d);
      }
    })();
  }, [username]);
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

  const handleGenerate = async ({
    model_name,
    style_name,
  }: {
    model_name: string;
    style_name: string;
  }) => {
    console.log({ model_name, style_name });
    setIsGenerating(true);
    // make 4 calls to generate_from_ai with promise.all
    // then set the generatedImages

    const { data } = (await generate_from_ai({
      user: user_id!,
      model_name,
      style_name,
      image_url: '',
      username,
    })) as AxiosResponse;
    if (data) {
      interval_timeout(20000, data, model_name, style_name);
    }

    // getUsers();
  };
  const handleFavorite = async (data: any) => {
    try {
      const { public_id, url } = data;
      await toggle_favorites({
        public_ids: [public_id],
        tag: url,
        isFavorite: false,
      });
      update_favorite();
      setModalOpen(false);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="">
      <section className="mt-10">
        <div className="flex justify-between md:pr-[178px] md:px-[68px] px-8 items-center">
          <h1 className="text-[32px] leading-[39px] font-semibold">
            Select Character Model
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
            {characters.map((c, id) => (
              <Card
                imageSrc={c.image_url}
                chrName={c.model_name}
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
      <section className="mt-10 md:pl-[68px] md:pr-[46px] pl-8">
        <div className="flex justify-between items-start flex-col">
          <h1 className="md:text-[32px] md:leading-[39px] text-[24px] leading-[24px] font-semibold">
            Select an image for stylistic inspiration.
          </h1>
        </div>
        <div className="space-y-8 mt-8">
          <Feed
            feeds={feed1}
            isGenerate
            setSelectedCard={setSelectedCard}
            selectedCard={selectedCard}
          />
          <Feed
            feeds={feed2}
            empty_meessage="No favorite character available"
            isGenerate
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
          disabled={
            Object.keys(selectedCardModel).length === 0 ||
            Object.keys(selectedCard).length === 0 ||
            isGenerating
          }
          className="px-6 py-[6px] flex font-dmSans italic text-sm w-fit rounded-[100px] relative mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(180deg, #B87FD9 0%, #5C4597 100%)',
          }}
        >
          <span>Generate</span>
        </button>
      </div>
      <div>
        <section className="pr-[34px] pl-[16px]">
          {isGenerating && (
            <div className="flex justify-center items-center mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
            </div>
          )}
          <div className="grid grid-cols-4 gap-[1px]">
            <>
              {isGenerating && (
                <>
                  {uploadingItem.map((ele, i) => {
                    return (
                      <GenerateItem
                        {...{
                          ele,
                          handleFavorite,
                          setModalOpen,
                          setClickDog,
                          isFavorite: false,
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
                          <div className="flex justify-center items-center mb-4 h-48 bg-gray-300 rounded dark:bg-gray-700">
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
                          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
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
            {generatedImages.map((ele, i) => {
              const isFavorite = !!favoriteImages.find(
                (fav) => fav.public_id === ele.public_id
              );
              return (
                <GenerateItem
                  {...{
                    ele,
                    handleFavorite,
                    setModalOpen,
                    setClickDog,
                    isFavorite,
                  }}
                  key={i}
                />
              );
            })}
          </div>
          {generatedImages.length > 0 && (
            <div className="flex justify-center my-5">
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
          )}
        </section>
        {modalOpen && (
          <ModalItem
            {...{ setModalOpen, clickDog, handleFavorite, favoriteImages }}
          />
        )}
      </div>
    </div>
  );
}
const ModalItem = ({
  setModalOpen,
  handleFavorite,
  clickDog,
  favoriteImages,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  clickDog: any;
  handleFavorite: (data: generateImageType) => void;
  favoriteImages: any[];
}) => {
  const textElement = useRef<HTMLDivElement>(null);
  const handleShare = () => {
    // select the text content
    const selection = window.getSelection() as Selection;
    const range = document.createRange();
    if (!textElement) return;
    range.selectNodeContents(textElement.current!);
    selection.removeAllRanges();
    selection.addRange(range);

    // copy the text to the clipboard
    document.execCommand('copy');
    toast.success('Copied to clipboard');

    // clear the selection
    selection.removeAllRanges();
  };
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
          <div className="relative  w-[60vh] h-[60vh]">
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
                <div className="hidden" ref={textElement}>
                  {clickDog.secure_url}
                </div>
                <div className="w-full flex justify-between items-center px-6 cursor-pointer">
                  <button>
                    <HeartIcon
                      color="rgb(239 68 68 / 1)"
                      onClick={() => handleFavorite(clickDog!)}
                      filled={isFavorite}
                    />
                  </button>
                  <span>|</span>
                  <button onClick={handleShare}>Share</button>
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
  handleFavorite,
  isFavorite,
}: {
  ele: any;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setClickDog: Dispatch<SetStateAction<generateImageType>>;
  isFavorite: boolean;
  handleFavorite: (data: any) => void;
}) => {
  return (
    <div
      className="relative group"
      onClick={() => {
        setModalOpen(true);
        setClickDog(ele);
      }}
    >
      <img src={ele.image_url || ele.url} alt="" />

      <div className="absolute bottom-4 w-full px-3 group-hover:flex hidden  justify-center">
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
                onClick={() => handleFavorite(ele)}
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
