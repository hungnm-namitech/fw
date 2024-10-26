import clsx from 'clsx';
import React, { HtmlHTMLAttributes } from 'react';

interface ChipProps extends HtmlHTMLAttributes<HTMLParagraphElement> {}

export default function Chip({ children, className, ...rest }: ChipProps) {
  return (
    <p
      className={clsx(
        'px-[10px] pt-[6px] pb-[7px] rounded-[30px] font-[400] text-[11px] leading-[100%] font-noto-sans-jp text-center',
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  );
}
