import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { signOut } from 'next-auth/react';
import { useAppContext } from '../context/appContext';

const SideBar = () => {
  return (
    <div className="sidebar bg-primary pt-4 w-full sm:flex flex-col justify-between hidden">
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <Image
            src="/logo.png"
            alt="logo"
            priority
            className="rounded-full"
            width={87}
            height={87}
          />
          <h2 className="text-[14px] leading-[12px] tracking-[-1%] font-bold">
            InstaPet
          </h2>
        </div>
        <FirstLinks />
      </div>
      {/* <SecondLinks /> */}
      {/* <ThirdLinks /> */}
    </div>
  );
};
export const FirstLinks = () => {
  const { pathname } = useRouter();
  const links: Array<{
    name: string;
    url: string;
    active?: boolean;
    icon: string;
  }> = [
    // {
    //   name: 'Home',
    //   url: '/portal',
    //   icon: '/Icons/Discovery.svg',
    // },
    {
      name: 'Generate',
      url: '/home',
      icon: '/Icons/Category.svg',
    },
    {
      name: 'Marketplace',
      url: '/market_place',
      icon: '/Icons/Chart.svg',
    },
    {
      name: 'Checkout',
      url: '/checkout',
      icon: '/Icons/Checkout.svg',
    },
    {
      name: 'Log out',
      url: '/log_out',
      icon: '/Icons/Logout.svg',
    },
    // {
    //   name: 'Mix (soon!) ',
    //   url: '/mix',
    //   icon: '/Icons/Mix.svg',
    // },
  ].map(
    (ele: { name: string; url: string; active?: boolean; icon: string }) => {
      ele.active = ele.url?.includes(pathname);
      return ele;
    }
  );

  const {
    state: { isGenerating, isTraining },
  } = useAppContext();
  const router = useRouter();

  const handleNav = (url: string) => {
    if (isGenerating && pathname === '/home') {
      return alert('generating in process, please wait!');
    } else if (isTraining && pathname === '/home')
      return alert('Model training in progress,please wait!');
    else router.push(url);
  };

  const { push } = useRouter();

  const handleSignOut = async () => {
    const data: any = await signOut({ redirect: true, callbackUrl: '/login' });

    // push(data.url)
  };
  return (
    <div className="space-y-[.5rem] md:space-y-3">
      <div className="flex flex-col md:space-y-3 space-[.5rem]">
        {links.map((item, id) => {
          return (
            <div onClick={() => router.push(item.url)} key={id}>
              <div
                className={classNames(
                  'flex items-center space-x-2 cursor-pointer pl-5 w-full py-2 mr-10',
                  {
                    'bg-secondary rounded-r-[50px] w-4/5': item?.active,
                  }
                )}
              >
                {item.name === 'Log out' ? (
                  <>
                    <Image src={item.icon} alt="" width={15} height={15} />
                    <button onClick={handleSignOut}>
                      <p className="text-[16px] leading-[24px] font-normal tracking-[-1%]">
                        {item.name}
                      </p>
                    </button>
                  </>
                ) : (
                  <>
                    <Image src={item.icon} alt="" width={15} height={15} />
                    <Link href={item.url}>
                      <p className="text-[16px] leading-[24px] font-normal tracking-[-1%]">
                        {item.name}
                      </p>
                    </Link>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export const SecondLinks = () => {
  const { pathname } = useRouter();
  const links: Array<{
    name: string;
    url: string;
    active?: boolean;
    icon: string;
  }> = [
    {
      name: 'Profile',
      url: '/profile',
      icon: '/Icons/Profile.svg',
    },
    {
      name: 'Purchases',
      url: '/purchases',
      icon: '/Icons/Folder.svg',
    },
    {
      name: 'Collections',
      url: '/collections',
      icon: '/Icons/Category.svg',
    },
    {
      name: 'Billing',
      url: '/billing',
      icon: '/Icons/Price.svg',
    },
  ].map(
    (ele: { name: string; url: string; active?: boolean; icon: string }) => {
      ele.active = pathname?.includes(ele.url);
      return ele;
    }
  );
  const {
    state: { isGenerating, isTraining },
  } = useAppContext();
  const router = useRouter();
  const handleNav = (url: string) => {
    if (isGenerating) return alert('generating in process, please wait!');
    else if (isTraining)
      return alert('Model training in progress,please wait!');

    router.push(url);
  };

  return (
    <div className="space-y-3">
      <h1 className="text-center text-[16px] leading-[24px] tracking-[-1%] font-bold">
        My Account
      </h1>
      <div className="flex flex-col space-y-3">
        {links.map((item, id) => {
          return (
            <div onClick={() => handleNav(item.url)} key={id}>
              <div
                className={classNames(
                  'flex items-center space-x-2 cursor-pointer pl-5 w-full py-2 mr-10',
                  {
                    'bg-secondary rounded-r-[50px] w-4/5': item?.active,
                  }
                )}
              >
                <Image src={item.icon} alt="" width={15} height={15} />
                <p className="text-[16px] leading-[24px] font-normal tracking-[-1%]">
                  {item.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export const ThirdLinks = () => {
  const { pathname } = useRouter();
  const links: Array<{
    name: string;
    url: string;
    active?: boolean;
    icon: string;
  }> = [
    {
      name: 'Settings',
      url: '/setting',
      icon: '/Icons/Setting.svg',
    },
  ].map(
    (ele: { name: string; url: string; active?: boolean; icon: string }) => {
      ele.active = pathname?.includes(ele.url);
      return ele;
    }
  );

  const { push } = useRouter();

  const handleSignOut = async () => {
    const data: any = await signOut({ redirect: true, callbackUrl: '/login' });

    // push(data.url)
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col space-y-3">
        {links.map((item, id) => {
          return (
            <div
              key={id}
              className={classNames(
                'flex items-center space-x-2 cursor-pointer pl-5 w-full py-2 mr-10',
                {
                  'bg-secondary rounded-r-[50px] w-4/5': item?.active,
                }
              )}
            >
              <Image src={item.icon} alt="" width={15} height={15} />
              {item.name === 'Log out' ? (
                <button onClick={handleSignOut}>
                  <p className="text-[16px] leading-[24px] font-normal tracking-[-1%]">
                    {item.name}
                  </p>
                </button>
              ) : (
                <Link href={item.url}>
                  <p className="text-[16px] leading-[24px] font-normal tracking-[-1%]">
                    {item.name}
                  </p>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default SideBar;
