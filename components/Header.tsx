import Image from 'next/image';
import React from 'react';
import SearchBar from './searchBar';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';

function normalize_email(email: any) {
  if (email?.includes('@')) {
    const split_mail = email.split('@')[0];
    return split_mail;
  } else {
    return email;
  }
}
const Header = ({
  setOpenMobileMenu,
}: {
  setOpenMobileMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { push } = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      push('/login');
    },
  });
  const user_instance = session?.user?.email || session?.user?.name;

  return (
    <div className="header ">
      <div className="bg-primaryDark flex md:pl-[68px] justify-between md:pr-[68px] px-[18px] flex-col md:flex-row space-y-4 md:space-y-0 pt-4 items-end md:items-center py-2">
        <div className="flex w-full justify-between md:w-fit md:justify-start mx-auto items-center">
          <Image
            src="/logo.png"
            width={40}
            height={40}
            alt=""
            className="rounded-full block md:hidden"
            onClick={() => setOpenMobileMenu(true)}
          />
          <h1 className="font-semibold md:text-[35px] text-[25px] leading-[22px] mx-auto">
       
            InstaPet.Art
          </h1>
          {/*<SearchBar />*/}
        </div>
        <div className="flex items-center space-x-[10px] bg-[#37394C] rounded-[15px] md:px-[11px] md:pr-[2rem] py-2 px-5 w-fit">
          <Image
            src="/images/avatar.png"
            className=""
            width={38}
            height={38}
            alt=""
          />
          <div className="space-y-2">
            <h1 className="font-semibold text-[18px] leading-[22px]">
              {normalize_email(user_instance)}
            </h1>
            <p className="font-normal text-[12px] leading-[15px] text-[#DDDDDD]">
              Creator <span className="font-semibold text-[#FFA552]">Pro+</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
