/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
// * eslint - disable @next/next/no - img - element * /
// import { Virtual } from 'swiper';

import classNames from 'classnames';
import { characterListTypes } from '../pages/portal';
type h = characterListTypes & {
  user_id: string;
};
const FavoriteFeed = ({
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
        <p className="font-semibold w-1/2 md:w-full md:text-[15px] text-[12px] leading-[14px]  md:leading-[18px] text-center">
          Favorite
        </p>
        <p className="font-semibold w-1/2 md:w-full md:text-[15px] text-[12px] leading-[14px]  md:leading-[18px] text-center">
          Collection
        </p>
      </div>
      {feeds.length > 0 ? (
        <div className="flex flex-row overflow-x-scroll">
          {feeds.map((feed, id) => {
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
                  src={feed.src || feed.url}
                  alt="feed"
                  className="h-[80px] min-w-[100px] w-[100px] rounded-[10px] object-cover"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex mx-auto h-[80px] items-center  ">
          No favorite character available
        </div>
      )}
    </div>
  );
};

export default FavoriteFeed;
