import { ButtonHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import Link from 'next/link';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'secondary';
  href?: string;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ color = 'primary', className, href, ...rest }, ref) => {
    const classes = twMerge(
      `bg-primary rounded-[4px] px-4 py-4 text-white text-center text-[16px] font-bold leading-[22px] tracking-[1.4px] w-full min-h-[56px]  ${
        className ?? ''
      }`,
    );
    return href ? (
      <Link href={href}>
        <button
          className={clsx([
            `bg-primary rounded-[4px] px-4 py-4 text-white text-center text-[16px] font-bold leading-[22px] tracking-[1.4px] w-full min-h-[56px] `,
            className,
          ])}
          ref={ref}
          {...rest}
          onClick={undefined}
        ></button>
      </Link>
    ) : (
      <button className={classes} ref={ref} {...rest}></button>
    );
  },
);
Button.displayName = 'Button';
