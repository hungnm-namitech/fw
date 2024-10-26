'use client';

import './style.css';
import { ICONS } from '../assets/icons';
import clsx from 'clsx';
import Image from 'next/image';
import React, { InputHTMLAttributes, forwardRef } from 'react';

interface IInlineSelectProps
  extends Omit<InputHTMLAttributes<HTMLSelectElement>, 'options'> {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  descriptions?: string[];
  labelClass?: string;
  inputWrapperClass?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
}

export default forwardRef<HTMLSelectElement, IInlineSelectProps>(
  function SelectField(
    {
      label,
      onChange,
      descriptions = [],
      labelClass = '',
      className = '',
      inputWrapperClass = '',
      options,
      placeholder,
      value,
      error,
      ...rest
    }: IInlineSelectProps,
    ref,
  ) {
    return (
      <div className={'flex flex-col gap-1 w-full select relative'}>
        {label && (
          <label
            className={
              'text-text-black text-[14px] leading-[150%] tracking-[0.07px] font-noto-sans-jp'
            }
            htmlFor={label}
          >
            {label}
          </label>
        )}
        <div>
          <select
            onChange={onChange}
            ref={ref}
            value={value}
            placeholder={placeholder}
            {...rest}
            className={clsx(
              'rounded-[4px] bg-white border-solid border-[1px] border-gray-1 w-full min-h-[40px] py-[9px] px-3 placeholder-main placeholder:text-[14px] placeholder:leading-[157.143%] placeholder:tracking-[0.07px] text-sm ',
              className,
            )}
          >
            <option value="" className="" disabled>
              {placeholder}
            </option>
            {options.map(option => (
              <option
                className="text-text-black"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
          <Image
            className="absolute bottom-[25%] right-[10.2px]"
            src={ICONS.AROW_DROP}
            alt="Chevron down"
          />
        </div>

        {!!error && <p className="text-xs text-red-600">{error}</p>}

        {!!descriptions.length && (
          <div className="grid mt-2 grid-cols-1 gap-1 p-2 bg-gray-2">
            {descriptions.map((description, index) => (
              <p key={index} className="text-xs tracking-[0.06px] leading-2">
                ※ {description}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  },
);
