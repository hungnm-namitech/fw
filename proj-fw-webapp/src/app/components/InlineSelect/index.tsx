'use client';

import clsx from 'clsx';
import React, { InputHTMLAttributes, forwardRef } from 'react';
import './style.css';
import { ICONS } from '../assets/icons';
import Image from 'next/image';
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
  function InlineSelect(
    {
      label,
      onChange,
      descriptions = [],
      name,
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
      <div className={clsx('flex items-start select', className)}>
        <p
          className={clsx(
            'table-cell text-md font-bold text-gray tracking-[0.08px] leading-2 w-[200px]',
            labelClass,
          )}
        >
          {label}
        </p>
        <div className={clsx('w-full max-w-[320px] ', inputWrapperClass)}>
          <div className="relative w-full">
            <select
              onChange={onChange}
              ref={ref}
              value={value}
              placeholder={placeholder}
              {...rest}
              className={clsx(
                ' border border-[#CFCFCF] text-[#A8A8A8] text-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-[12px] py-[9px] rounded-[4px]',
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
            <Image
              className="absolute top-[50%] right-[11px] -translate-y-1/2"
              src={ICONS.CHEVRON_DOWN}
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
      </div>
    );
  },
);
