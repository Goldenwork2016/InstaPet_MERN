/* eslint-disable react-hooks/exhaustive-deps */
import axios, { AxiosResponse } from 'axios';
import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  check_progress,
  upload_kubernetes_server,
  post_session_images,
  get_session_images,
  delete_session_images,
} from '../../apis';
import { useAppContext } from '../../context/appContext';
import { safeWindow } from '../../lib/window';
const AddCard = ({
  setModalOpen,
  images,
  setImages,
  username,
  input,
  setInput,
  getCardCharacters,
  characterList,
  setVerifyModalOpen,
  isVerifyTraining,
  handleImageUpload,
  setIsVerifyTraining,
  userId,
}: {
  images: File[];
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  userId: string;
  username: string;
  input?: any;
  handleImageUpload?: any;
  setInput?: any;

  characterList?: any;

  setVerifyModalOpen?: any;
  isVerifyTraining?: boolean;
  setIsVerifyTraining?: any;
  getCardCharacters: () => void;
}) => {
  const [isOpenNote, setIsOpenNote] = React.useState(false);
  const handPlus = () => {
    setIsOpenNote(true);
    setModalOpen(true);
  };
  const [isTrained, setIsTrained] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isProgress, setIsProgress] = useState(false);
  const [submiting, setSubmitting] = useState(false)
  const { state, setState } = useAppContext();
  useEffect(() => {
    if (isTrained || isProgress) {
      setState({ ...state, isTraining: true });
    } else {
      setState({ ...state, isTraining: false });
    }
  }, [isProgress, isTrained]);
  useEffect(() => {
    if (images?.length > 0) setIsOpenNote(true);
  }, [images]);

  const check_status_progress = async (time = 500) => {
    setTimeout(async () => {
      const res = await check_progress({
        userid: username,
        key: '12345_unused',
        name: input.name,
      });
      if (res?.data?.ERROR) {
        check_status_progress(time + 500);
      } else if (res?.data?.status) {
        const { status } = res?.data;
        if (status >= 100) {
          setIsProgress(false);
          toast.success('Training Complete');
          setIsTrained(false);
          setProgress(0);
          getCardCharacters();
          setInput({ name: '', breed: '', species: '' });
          setIsOpenNote(false);
          return true;
        } else if (res?.data?.status === -1) {
          setProgress(0);
          check_status_progress(time + 500);
        } else if (status === progress) {
          setProgress(status);
          time = time < 5000 ? time : 1000;
          check_status_progress(time + 500);
        } else {
          setProgress(status);
          check_status_progress(1000);
        }
      }
    }, time);
  };
  const handleUploadToCloudinary = async (uploadedInput?: any) => {
    if (!userId) return;
    const { data } = (await get_session_images(userId)) as AxiosResponse;
    if (!data?.success) return;
    const uploadedImages = data?.data?.images_base_64;
    const uploadRes = await Promise.all(
      uploadedImages.map(async (image: any) => {
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', 'maincharacter_app');
        const { data: dataRes } = await axios.post(
          'https://api.cloudinary.com/v1_1/mainchar/image/upload',
          data
        );

        return dataRes;
      })
    );

    setTimeout(async () => {
      //TODO: send to kubernates server

      const k = await upload_kubernetes_server({
        name: uploadedInput?.name || input.name,
        username,
      });
      // console.log({ k });
      if (k?.data?.success != 0) {
        toast.success('Training in progress!');
        setImages([]);
        setIsOpenNote(false);
        safeWindow(async () => {
          await delete_session_images(userId);
          window.sessionStorage.removeItem('input');
          window.sessionStorage.removeItem('payment_intent');
          window.sessionStorage.removeItem('payment_intent_client_secret');
        });
        new Promise((resolve) => setTimeout(resolve, 10000));
        setIsProgress(true);
        check_status_progress();
      } else {
        setImages([]);
        setIsOpenNote(false);
        toast.error('Something went wrong while uploading');
      }
    }, 1000);
  };

  const payment_intent = safeWindow(() =>
    window.sessionStorage.getItem('payment_intent')
  );
  useEffect(() => {
    if (payment_intent) {
      handleTrain();
    }
  }, [payment_intent]);
  const router = useRouter();
  const handleTrain = async () => {
    const uploadedInput = safeWindow(() =>
      JSON.parse(window.sessionStorage.getItem('input') || '{}')
    );
    if (!payment_intent) {
      const fileImage: any[] = [];
      images.forEach((image, i) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = function () {
          const base64EncodedString = reader.result as string;
          fileImage.push(base64EncodedString);

          if (fileImage.length === images.length) {
            safeWindow(async () => {
              window.sessionStorage.setItem('userId', userId);
              await post_session_images({
                userId,
                images_base_64: fileImage,
              });
              window.sessionStorage.setItem('input', JSON.stringify(input));
              setTimeout(() => {
                router.push('/checkout');
              }, 1000);
            });
          }
        };

        reader.onerror = function () {
          console.log(reader.error);
        };
      });
    } else {
      setIsTrained(true);
      handleUploadToCloudinary(uploadedInput);
    }
  };
  useEffect(() => {
    if (isVerifyTraining) {
      handleTrain();
      setIsVerifyTraining(false);
    }
  }, [isVerifyTraining]);
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    setSubmitting(true)
    const character = characterList.find(
      (i: any) => i.model_name === input.name
    );
    if (character && !payment_intent) {
      setVerifyModalOpen(true);
    } else handleTrain();
  };
  return (
    <form
      className={classNames(
        'md:w-[350px] flex-shrink-0 md:h-[350px] w-[250px] h-[250px] rounded-[20px] bg-[#37394C] px-4 py-8 flex flex-col  relative cursor-pointer gap-[0.25em] ',
        {
          'justify-between': !isProgress,
          'space-y-6': isProgress,
        }
      )}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex justify-between gap-2">
        <div
          className="py-2 z-[3] pl-[14px] pr-[26px] rounded-[8px] font-dmSans italic font-normal text-sm w-fit truncate "
          style={{
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)',
            boxShadow: '0px 0px 24px -1px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {input.name || 'New Char'}
        </div>
        {isOpenNote && (
          <div
            className="py-2 z-[3] pl-[14px] pr-[26px] rounded-[8px] font-dmSans italic font-normal text-sm w-fit truncate"
            style={{
              background:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)',
              boxShadow: '0px 0px 24px -1px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {images?.length || 0} image{images?.length > 1 ? 's' : ''} selected
            ✅
            <input
              type="file"
              multiple
              name=""
              id=""
              className="absolute bg-transparent inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageUpload}
            />
          </div>
        )}
      </div>
      {images?.length && !isTrained ? (
        <>
          <div
            className="py-2 space-x-3 pl-[14px] flex rounded-[8px] font-dmSans italic font-normal text-sm w-2/3 "
            style={{
              background:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)',
              boxShadow: '0px 0px 24px -1px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <p>
              NAME: <span className="h-[10px] w-[1px] bg-secondary"></span>
            </p>
            <input
              type="text"
              name="name"
              className="w-full bg-transparent border-none outline-none focus:outline-none focus:border-none"
              onChange={handleInput}
              required
              value={input.name}
            />
          </div>
          <div
            className="py-2 space-x-3 pl-[14px] flex rounded-[8px] font-dmSans italic font-normal text-sm w-2/3"
            style={{
              background:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)',
              boxShadow: '0px 0px 24px -1px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <p>
              SPECIES: <span className="h-full w-[1px] bg-secondary"></span>
            </p>
            <input
              type="text"
              className="w-full bg-transparent border-none outline-none focus:outline-none focus:border-none"
              name="species"
              onChange={handleInput}
              required
              value={input.species}
            />
          </div>{' '}
          <div
            className="py-2 space-x-3 pl-[14px] flex rounded-[8px] font-dmSans italic font-normal text-sm w-2/3"
            style={{
              background:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)',
              boxShadow: '0px 0px 24px -1px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <p>
              BREED: <span className="h-full w-[1px] bg-secondary"></span>
            </p>
            <input
              type="text"
              placeholder="(Optional)"
              className="w-full bg-transparent border-none outline-none focus:outline-none focus:border-none"
              name="breed"
              onChange={handleInput}
              value={input.breed}
            />
          </div>
        </>
      ) : isTrained ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-[14px] leading-[22px] font-dmSans italic font-bold">
            TRAINING IN PROGRESS
          </p>
          {
            <div className="w-3/4 flex flex-col justify-center items-center space-y-1 my-2">
              <div className="bg-primary w-full h-[5px] rounded-full">
                <div
                  className="bg-secondary h-[5px] rounded-full animate-pulse transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm">{progress}%</span>
            </div>
          }
          <p>(takes about 20 minutes)</p>
        </div>
      ) : (
        <div
          className="mx-auto w-full text-center flex justify-center"
          onClick={handPlus}
        >
          <Image src="/Icons/PlusLg.svg" width={68} height={68} alt="" />
        </div>
      )}

      {!isProgress && (
        <div
          className="md:py-4  py-2 rounded-[20px] font-dmSans  font-bold text-sm w-full flex justify-center"
          style={{
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)',
            boxShadow: '0px 0px 24px -1px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <button
            onClick={(e) => {
              if (!images.length) return handPlus();
              else handleSubmit();
            }}
            type="submit"
          >
            {!submiting ? "Train new AI model" : "Loading..."}
          </button>
        </div>
      )}
    </form>
  );
};

export default AddCard;
