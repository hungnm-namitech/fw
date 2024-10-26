import React from 'react';
import { ITEMS as PC_ITEMS } from './pc-items';
import { ITEMS as FW_ITEMS } from './fw-items';
import { ITEMS as SUPPLIER_ITEMS } from './supplier-items';
import Image from 'next/image';
import { USER_ROLE } from '@/lib/constants';
import Link from 'next/link';

interface ToppageMenuProps {
  role: number;
}

const MenuItem: React.FC<{ label: string; icon: string; link: string }> = ({
  label,
  icon,
  link,
}) => {
  return (
    <Link
      href={link}
      className="w-[196px] h-[196px] flex flex-col items-center border-[3px] border-solid cursor-pointer border-[#979797] justify-center rounded-2"
      key={label}
    >
      <Image className="w-[53px] h-[71px] " alt={label} src={icon} />
      <p className="text-md leading-[22px] font-bold  whitespace-pre text-center tracking-[0.96px] text-bold mt-[38.47px]">
        {label}
      </p>
    </Link>
  );
};

const ToppageMenu: React.FC<ToppageMenuProps> = ({ role }) => {
  return (
    <div className="pr-[97px]">
      <p className="h-[21px] text-text-black font-bold text-3xl leading-normal tracking-[1.44px] ml-[61px] ">
        メニュー選択
      </p>

      <div className="mt-12 ml-[239px] flex items-center flex-wrap gap-x-[113px] gap-y-8">
        {role === USER_ROLE.PC &&
          PC_ITEMS.map((item, key) => (
            <MenuItem
              key={key}
              icon={item.icon}
              label={item.label}
              link={item.link}
            />
          ))}

        {(role === USER_ROLE.FW || role === USER_ROLE.ADMIN) &&
          FW_ITEMS.map((item, key) => (
            <MenuItem
              key={key}
              icon={item.icon}
              label={item.label}
              link={item.link}
            />
          ))}

        {role === USER_ROLE.SUPPLIER &&
          SUPPLIER_ITEMS.map((item, key) => (
            <MenuItem
              key={key}
              icon={item.icon}
              label={item.label}
              link={item.link}
            />
          ))}
      </div>
    </div>
  );
};

export default ToppageMenu;
