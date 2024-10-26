'use client';

import clsx from 'clsx';
import React, { InputHTMLAttributes, forwardRef } from 'react';
import Image from 'next/image';
import { ICONS } from '../assets/icons';

interface SelectProps
  extends Omit<InputHTMLAttributes<HTMLSelectElement>, 'options'> {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  descriptions?: string[];
  inputWrapperClass?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  labelClassName?: string;
}

export default forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    labelClassName,
    className,
    error,
    placeholder,
    options,
    value,
    onChange,
    ...rest
  }: SelectProps,
  ref,
) {
  return (
    <div className={'select flex flex-col gap-1 w-full relative'}>
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
      <div className="relative">
        <select
          onChange={onChange}
          ref={ref}
          value={value}
          placeholder={placeholder}
          id={label}
          {...rest}
          className={clsx(
            'border border-[#667080] text-[#667080] text-sm rounded-1.5 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10',
            "bg-[url('/chevron-down.svg')] bg-no-repeat bg-[center_right_10px] appearance-none",
            className,
            { 'text-text-black': !!value },
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
      </div>
      {!!error && (
        <p className="text-xs text-red-600" data-error="error">
          {error}
        </p>
      )}
    </div>
  );
});
