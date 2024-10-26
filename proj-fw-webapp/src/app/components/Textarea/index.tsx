import clsx from 'clsx';
import React, { HtmlHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends HtmlHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  descriptions?: string[];
  inputWrapperClass?: string;
  placeholder?: string;
  error?: string;
  labelClassName?: string;
  value?: string;
}

export default forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, labelClassName, className, error, value, ...rest }: TextareaProps,
  ref,
) {
  return (
    <div className={'flex flex-col gap-1 w-full'}>
      {label && (
        <label
          className={clsx(
            'text-text-black text-[14px] leading-[150%] tracking-[0.07px] font-noto-sans-jp',
            labelClassName,
          )}
          htmlFor={label}
        >
          {label}
        </label>
      )}
      <textarea
        className={clsx(
          'rounded-[4px] resize-none bg-white border-solid border-[1px] border-gray-1 w-full min-h-[40px] py-[9px] px-3 placeholder-main placeholder:text-[14px] placeholder:leading-[157.143%] placeholder:tracking-[0.07px] font-noto-sans-jp placeholder:font-noto-sans-jp ',
          className,
          {
            'text-[#667080]': !value,
            'text-text-black': !!value,
          },
        )}
        id={label}
        ref={ref}
        value={value}
        {...rest}
      ></textarea>

      {error && (
        <p className={'text-red-500 mt-2 font-noto-sans-jp text-[14px]'}>
          {error}
        </p>
      )}
    </div>
  );
});
