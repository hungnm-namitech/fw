'use client';

import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import { ITEMS, Item } from './items';
import Link from 'next/link';
import { ICONS } from '@/app/assets/icons';
import { usePathname, useSearchParams } from 'next/navigation';
import CLSX from 'clsx';
import { useSession } from 'next-auth/react';
import Loader from '@/app/components/Loader';

interface CommonMenuProps {
  wrapperClass?: string;
  onCollapse?: () => void;
  expend?: boolean;
}

interface IMenuItemProps {
  item: Item;
  expend: boolean;
  userRole?: number;
}

const MenuItem: React.FC<IMenuItemProps> = ({ item, expend, userRole }) => {
  const pathname = usePathname();

  const searchName = useSearchParams();

  const [open, setOpen] = useState(pathname.startsWith(item.path));

  const childItems = useMemo(
    () =>
      item.children
        ? item.children.filter(
            i =>
              !i.hasAnyRole ||
              !!i.hasAnyRole.find(requireRole => requireRole === userRole),
          )
        : [],
    [item.children, userRole],
  );

  const selected =
    pathname === item.path &&
    searchName.toString() === (item.search || '') &&
    !childItems.length;

  const wrapperClass = CLSX(
    'bg-[#FCF8E8] pl-6 w-full flex flex-row items-center py-3 cursor-pointer',
    {
      'bg-primary': selected,
      'py-6 pl-[34px]': !expend,
      'border-y-[1px] border-white': !(item.icon && item.activeIcon),
    },
  );

  const textClass = CLSX(
    {
      'text-[#FCF8E8]': selected,
      'text-bold': !selected,
      hidden: !expend,
    },
    'text-md leading-1 font-bold ml-2 ',
  );

  const itemBody = (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          {item.icon && item.activeIcon ? (
            <Image
              className="w-[32px] h-[32px]"
              alt={item.label}
              src={selected ? item.activeIcon : item.icon}
            />
          ) : (
            <div className="w-[32px] h-[32px]"></div>
          )}
          <p className={textClass}>{item.label}</p>
        </div>
        {!!item.children && (
          <Image
            alt="Vector"
            className={CLSX('w-[8px] h-[13px] mr-[23px]', {
              hidden: !expend,
              'rotate-180': open,
            })}
            src={ICONS.VECTOR}
          />
        )}
      </div>
    </>
  );
  // border-y-[1px] border-white
  if (!!childItems.length) {
    return (
      <div>
        <div onClick={() => setOpen(o => !o)} className={wrapperClass}>
          {itemBody}
        </div>
        {open && (
          <div>
            {childItems.map((childItem, index) => (
              <MenuItem
                expend={expend}
                item={childItem}
                userRole={userRole}
                key={index}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link className={wrapperClass} href={item.path + `?${item.search || ''}`}>
      {itemBody}
    </Link>
  );
};

const CommonMenu: React.FC<CommonMenuProps> = ({
  wrapperClass = '',
  onCollapse = () => {},
  expend = true,
}) => {
  const { data, status } = useSession();

  if (status === 'loading') return <Loader />;

  const userRole = data?.user.role;

  return (
    <aside
      className={`bg-[#61876E] transition-all duration-500 min-h-full h-screen flex flex-col items-center   absolute left-0 top-0 ${wrapperClass}`}
    >
      <div
        className={CLSX(
          'h-[64px] flex items-center justify-end w-full pr-[20px]',
          { 'h-[80px] !pr-0': !expend },
        )}
      >
        <button
          className={CLSX({
            'h-full w-full flex items-center justify-center': !expend,
          })}
          onClick={onCollapse}
        >
          <Image
            alt="Collapse menu"
            className={CLSX('w-[24px] h-[24px]', { 'rotate-180': !expend })}
            src={ICONS.FRAME}
          />
        </button>
      </div>
      <div className="w-full flex flex-col">
        {ITEMS.map((item, index) =>
          item.hasAnyRole ? (
            item.hasAnyRole.find(role => role == userRole) ? (
              <MenuItem
                userRole={userRole}
                expend={expend}
                key={index}
                item={item}
              />
            ) : null
          ) : (
            <MenuItem
              userRole={userRole}
              expend={expend}
              key={index}
              item={item}
            />
          ),
        )}
      </div>
    </aside>
  );
};

export default CommonMenu;
