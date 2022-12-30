/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useState } from 'react';
import Feed from '../components/Feed';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';

import { InferGetServerSidePropsType } from 'next';

export type uploadedImageTypes = {
    secure_url: string;
    public_id: string;
}[];
function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { push } = useRouter();
    const { data: session } = useSession({
        required: true,
        onUnauthenticated: () => {
            push('/auth/login');
        },
    });

    // console.log('session', session);
    const user_id = session?.user?.id;
    console.log('user_id', user_id);

    const feed2 = {
        avatar: {
            name: 'Favorites Collection',
            src: '',
        },
        feeds: [
            {
                src: '/images/Card/dog3.png',
                name: 'steampunk',
            },
            {
                src: '/images/Card/dog4.png',
                name: 'steampunk',
            },
            {
                src: '/images/Card/dog5.png',
                name: 'steampunk',
            },
            {
                src: '/images/Card/dog6.png',
                name: 'steampunk',
            },
            {
                src: '/images/Card/dog7.png',
                name: 'steampunk',
            },
            {
                src: '/images/Card/dog7.png',
                name: 'steampunk',
            },
            {
                src: '/images/Card/dog7.png',
                name: 'steampunk',
            },
            {
                src: '/images/Card/dog7.png',
                name: 'steampunk',
            },
            {
                src: '/images/Card/dog7.png',
                name: 'steampunk',
            },
            {
                src: '/images/Card/dog3.png',
                name: 'steampunk',
            },
            {
                src: '/images/Card/dog4.png',
                name: 'steampunk',
            },
            {
                src: '/images/Card/dog5.png',
                name: 'steampunk',
            },
            {
                src: '/images/Card/dog6.png',
                name: 'steampunk',
            },
        ],
    };
    const [selectedCard, setSelectedCard] = useState<{ [key: string]: any }>({});

    return (
        <div className="space-y-8">
            <section className="mt-10">
                <div className="flex justify-between md:pr-[178px] md:px-[68px] px-8 items-center">
                    <div>
                        <h1 className="text-[32px] leading-[39px] font-semibold">
                            Select an image
                        </h1>
                        <p className="text-white/75 font-sm">
                            Hear you can custom order frame prints, phone cases, NFTs and
                            more!
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="text-[16px] leading-[20px] font-medium text-[#B87FD9]"
                    >
                        Find more Images
                    </Link>
                </div>

                <div className="space-y-8 mt-8 pl-8 pr-2">
                    <Feed
                        feeds={feed2}
                        isGenerate
                        setSelectedCard={setSelectedCard}
                        selectedCard={selectedCard}
                        isDoubled
                    />
                </div>
            </section>
            <section className="px-8">
                <div className="mb-8">
                    <h1 className="text-[32px] leading-[39px] font-semibold">
                        Select an image
                    </h1>
                </div>
                <div className="pb-8">
                    <div className="grid grid-cols-5 gap-10 ">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                            <div key={index}>
                                <img
                                    src="/images/Card/dog.png"
                                    alt=""
                                    className="w-full h-[300px] object-cover rounded-2xl"
                                />
                                <div className="space-y-3 mt-4">
                                    <h4 className="text-[20px] leading-[24px] font-semibold">
                                        Aluminum Print 24x24
                                    </h4>
                                    <p className="text-[20px] leading-[24px] font-semibold text-secondary">
                                        $90
                                    </p>
                                    <button className="py-1 px-2 border-[1px] border-[#FFA552] text-[#FFA552] hover:bg-[#ffa552] hover:text-primary">
                                        <p className="text-[16px] leading-[20px] font-normal ">
                                            Buy Now
                                        </p>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
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