'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ICONS } from '../assets/icons';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    signOut({ redirect: false }).then(() => {
      router.push('/login');
    });
  };

  useEffect(() => {
    const handleGlobalClick = (e: any) => {
      if (isOpen && e.target.closest('.dropdown') === null) {
        closeDropdown();
      }
    };

    window.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [isOpen]);
  return (
    <div className="h-[64px] sticky top-0 z-[100]  bg-main flex items-center justify-between border-b-[1px] border-solid border-border pl-6 pr-4">
      <div className="flex items-center">
        <div className="cursor-pointer" onClick={() => router.back()}>
          <Image
            className="w-[32px] h-[32px]"
            alt="User"
            src={ICONS.ARROW_LEFT}
          />
        </div>
        <span className="text-xl leading-2 font-normal tracking-[1.4px] text-text-black ml-2">
          {title}
        </span>
      </div>
      <button
        className="flex items-center relative dropdown"
        onClick={toggleDropdown}
      >
        <Image className="mr-[6px]" alt="User" src={ICONS.USER} />
        <Image alt="User" src={ICONS.ARROW_DOWN} />
        {isOpen && (
          <div
            className="absolute bg-main w-[150px] top-full right-[20%] shadow-lg "
            onClick={closeDropdown}
          >
            <ul>
              <li className="py-2 px-1 hover:bg-primary" onClick={handleLogout}>
                ログアウト
              </li>
            </ul>
          </div>
        )}
      </button>
    </div>
  );
};

export default PageHeader;
