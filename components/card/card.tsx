/* eslint-disable @next/next/no-img-element */
import classNames from 'classnames';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { check_progress } from '../../apis';

const Card = ({
  imageSrc,
  chrName,
  isGenerateCard,
  selectedCard,
  setSelectedCard,
  id,
  status: inputStatus,
  username,
}: {
  chrName?: string;
  imageSrc: string;
  isGenerateCard?: boolean;
  selectedCard?: any;
  setSelectedCard?: any;
  id?: number;
  status?: number;
  username: string;
}) => {
  const [imageAvailable, setImageAvailable] = useState(true);
  const [status, setStatus] = useState(inputStatus);

  useEffect(() => {
    (async function () {
      // fetch image with content type image/png
      const res = await fetch(imageSrc, {
        method: 'HEAD',
      });
      if (res.status === 404) {
        setImageAvailable(false);
      }
    })();
  }, [imageSrc]);
  useEffect(() => {
    let interval: any;
    if (status && status !== 200 && username && chrName) {
      interval = setInterval(async () => {
        const res = await check_progress({
          userid: username,
          key: '12345_unused',
          name: chrName!,
        });
        if (res?.data) {
          console.log(chrName, ' status updated to: ', res.data.status);
          setStatus(res.data.status);
          if (res.data.status === 200) return;
        }
      }, 10000);
    }
    return () => clearInterval(interval);
  });
  return (
    <div
      className={classNames(
        ' rounded-[20px] bg-[#37394C] px-4 py-8 flex flex-col justify-between  relative cursor-pointer hover:bg-purple-800',
        {
          '!bg-violet-800': selectedCard && selectedCard?.id === id,
          'md:w-[350px] flex-shrink-0 md:h-[350px] w-[250px] h-[250px]': true,
        }
      )}
      onClick={() =>
        setSelectedCard &&
        setSelectedCard({
          id,
          imageSrc,
          name: chrName,
        })
      }
    >
      <>
        <div className="absolute inset-3">
          {imageAvailable ? (
            <img
              src={imageSrc}
              alt=""
              className={classNames('w-full h-full rounded-xl object-cover')}
            />
          ) : (
            <div className="w-full h-full bg-[#37394C] flex items-center justify-center">
              <p className="text-[#BDBDBD] text-[12px] font-semibold">
                Image not available
              </p>
            </div>
          )}
        </div>
      </>

      <div className="flex justify-between">
        <div
          className="py-2 z-[3] pl-[14px] pr-[26px] rounded-[8px] font-dmSans italic font-normal text-sm w-fit"
          style={{
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)',
            boxShadow: '0px 0px 24px -1px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {chrName ? chrName : 'NEW CHAR'}{' '}
          {status && status === 200
            ? '✅'
            : status! < 100
            ? `- ${status}% complete`
            : status! < 200
            ? `${status! - 100}% running inference`
            : `⚠️ ${status} error`}
        </div>
      </div>
      {!isGenerateCard && (
        <div
          className="py-4 rounded-[20px] font-dmSans  font-bold text-sm w-full flex justify-center"
          style={{
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)',
            boxShadow: '0px 0px 24px -1px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="w-full flex justify-between items-center px-3">
            <p>Generate</p>
            <span>|</span>
            <p>View</p>
            <span>|</span>
            <p>Remove</p>
            <span>|</span>
            <p>Mix</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
