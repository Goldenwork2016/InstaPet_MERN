import classNames from 'classnames';
import Image from 'next/image';

/* eslint-disable @next/next/no-img-element */
const OurPickFeed = ({
  feeds,
  setSelectedCard,
  selectedCard,
}: {
  feeds: {
    src: string;
    name?: string;
    id?: string | number;
    url?: string;
    public_id?: string;
  }[];
  setSelectedCard: React.Dispatch<React.SetStateAction<any>>;
  selectedCard: any;
}) => {
  // get the width of the div
  const random = {
    url: '/images/Card/random.png',
    name: 'random',
    style_name: 'random',
    public_id: 'random',
  };
  const newArr = [random, ...feeds];
  const handlePick = (feed: any) => {
    const isPick = selectedCard?.public_id === feed.public_id;
    setSelectedCard(isPick ? null : feed);
  };
  return (
    <div
      className="bg-[#343646] px-3 py-4 rounded-[15px] w-full flex "
      style={{
        boxShadow: '0px 5px 24px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="w-[120px] flex-shrink-0 flex flex-col justify-center items-center space-y-[6px]">
        <Image
          src={'/Icons/Verify.svg'}
          width={48}
          height={48}
          alt=""
          className="rounded-full"
        />
        <p className="font-semibold w-1/2 md:w-full md:text-[15px] text-[12px] leading-[14px]  md:leading-[18px] text-center">
          Our Picks
        </p>
      </div>
      <div className="flex flex-row overflow-x-scroll">
        {newArr.map((feed, id) => {
          const isSelected = selectedCard?.public_id === feed.public_id;
          return (
            <div
              className={classNames(
                `flex flex-col items-center justify-center mr-4 p-[5px] rounded-[10px]`,
                {
                  'bg-[#5C4597]': isSelected,
                }
              )}
              key={id}
              onClick={() => handlePick(feed)}
            >
              <img
                src={feed.url}
                alt="feed"
                className="h-[80px] min-w-[100px] w-[100px] rounded-[10px] object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OurPickFeed;
