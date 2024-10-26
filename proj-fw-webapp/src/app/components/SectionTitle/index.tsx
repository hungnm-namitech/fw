import { ICONS } from '@/app/assets/icons';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

interface ISectionTitleProps {
  title: string;
  className?: string;
  btnClose?: string;
  btnClassName?: string;
  toggleClose?: () => void;
  toggle?: boolean;
}

const SectionTitle: React.FC<ISectionTitleProps> = ({
  title,
  className,
  btnClose,
  btnClassName,
  toggleClose,
  toggle,
}) => {
  return (
    <div
      className={
        'pt-[13px] pb-[14px] pl-5 border-l-[4px]  border-solid border-[#3C6255] w-full bg-[#F5F7F8] ' +
        className
      }
    >
      <p className="text-2xl leading-normal font-bold">{title}</p>
      {!!btnClose && (
        <button
          onClick={toggleClose}
          className={'flex text-2xl gap-[10px] ' + btnClassName}
        >
          <span>{btnClose}</span>
          <Image
            width={32}
            height={32}
            src={ICONS.ARROW_TOP}
            alt=""
            className={clsx({
              'rotate-180': !toggle,
            })}
          />
        </button>
      )}
    </div>
  );
};

export default SectionTitle;
