/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Feed from '../components/Feed';
import { collections } from '../apis';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { InferGetServerSidePropsType } from 'next';
import { AxiosResponse } from 'axios';
import { mapRtr } from '../apis/api.interface';
export type collectionImagesTypes = {
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

function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { push } = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      push('/login');
    },
  });

  const user_id: any = session?.user?.id;
  const [collectionImages, setCollectionImage] = useState<
    collectionImagesTypes[]
  >([]);
  const [otherCreatorImages, setOtherCreatorImages] =
    useState<collectionImagesTypes>();

  function getObjKey(obj: any, value: any) {
    return Object.keys(obj).find((key) => obj[key] === value);
  }

  useEffect(() => {
    const collections_feeds: any[] = [];
    const getCollectionImages = async () => {
      const { data } = (await collections(user_id)) as AxiosResponse;

      const valued_data: Array<[]> = Object.values(data.data);
      for (const value of valued_data) {
        // console.log("vaule=>", value)
        const image_src = value.map((item: any) => {
          return {
            src: item.image_url,
          };
        }) as mapRtr[];

        const q_name = getObjKey(data.data, value);
        const collectionData = {
          avatar: {
            name: q_name,
            src: `/characters/${q_name}.png`,
          },
          feeds: image_src,
        };
        collections_feeds.push(collectionData);
      }
      const creators_images = data.other_creator.map((items: any) => {
        return { src: items.image_url };
      });

      const other_creator_data = {
        avatar: {
          name: 'Other Creators',
          src: '/images/Card/avatar2.png',
        },
        feeds: creators_images,
      };

      // console.log("other creator=>", other_creator_data)

      setCollectionImage(collections_feeds);
      setOtherCreatorImages(other_creator_data);
    };

    getCollectionImages();
  }, [user_id]);

  // console.log(collectionImages)

  return (
    <div className=" py-[25px]">
      <section className="mt-10 md:pl-[68px] pl-8 md:pr-[46px] space-y-5">
        <div className="flex space-x-12 md:pr-[178px] items-center pr-8">
          <h1 className="md:text-[32px] md:leading-[39px] text-[24px] leading-[24px] font-semibold">
            Your Favs
          </h1>
          <Link
            href="/"
            className="text-[16px] leading-[20px] font-medium text-[#B87FD9]"
          >
            All Creators
          </Link>
        </div>
        <div className="space-y-8">
          {otherCreatorImages && <Feed feeds={otherCreatorImages} />}
          {collectionImages &&
            collectionImages.map((items, index) => {
              return (
                <div key={index}>
                  <Feed feeds={items} />
                </div>
              );
            })}
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




