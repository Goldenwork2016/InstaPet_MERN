import Image from 'next/image';
import React, { Fragment } from 'react';
import Header from './Header';
import SideBar, { FirstLinks, SecondLinks, ThirdLinks } from './sideBar';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
const Layout = ({ children }: { children: React.ReactNode }) => {
  const [openMobileMenu, setOpenMobileMenu] = React.useState(false);
  const { pathname } = useRouter();
  const isGeneratePath = pathname.includes('/generate');
  return (
    <div className="parent text-white h-screen w-full bg-dark md:overflow-y-hidden">
      <SideBar />
      <Header setOpenMobileMenu={setOpenMobileMenu} />
      <Transition
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-x-50"
        enterTo="opacity-100 scale-x-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-50"
        appear
        show={openMobileMenu}
        as={Fragment}
      >
        <div className="fixed inset-0 bg-[#37394C80] z-[100]">
          <div className="flex flex-col h-screen w-full">
            <div className="bg-primary pt-2 w-full h-full sm:flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between px-8 py-3 items-center">
                  <div className="flex flex-col items-center space-y-3">
                    <Image
                      src="/logo.png"
                      alt="logo"
                      priority
                      className="rounded-full"
                      width={40}
                      height={40}
                    />
                    <h2 className="text-[12px] leading-[12px] tracking-[-1%] font-bold">
                      InstaPet.art
                    </h2>
                  </div>
                  <div>
                    <XMarkIcon
                      className="h-6 w-6 text-white"
                      onClick={() => setOpenMobileMenu(false)}
                    />
                  </div>
                </div>
                <FirstLinks />
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <div
        className={classNames(
          'content bg-primaryDark overflow-y-auto overflow-x-hidden no-scrollbar relative',
          {
            '!bg-[#1E1E2C]': isGeneratePath,
          }
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
