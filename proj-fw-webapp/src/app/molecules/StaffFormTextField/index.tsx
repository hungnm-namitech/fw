//'use client';

import clsx from 'clsx';
import React, { InputHTMLAttributes } from 'react';

interface StaffFormTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  descriptions?: string[];
  labelClass?: string;
  inputWrapperClass?: string;
  viewOnly?: boolean;
  error?: string;
}
interface StaffFormTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  descriptions?: string[];
  labelClass?: string;
  inputWrapperClass?: string;
  viewOnly?: boolean;
  error?: string;
}
export default React.forwardRef<HTMLInputElement, StaffFormTextFieldProps>(
  function StaffFormTextField(
    {
      label,
      onChange,
      descriptions = [],
      name,
      labelClass = '',
      className = '',
      inputWrapperClass = '',
      value,
      viewOnly,
      error,
    }: StaffFormTextFieldProps,
    ref,
  ) {
    return (
      <div className={clsx('flex items-start', className)}>
        <p
          className={clsx(
            'table-cell text-md font-bold text-gray tracking-[0.08px] leading-2 w-[200px]',
            labelClass,
          )}
        >
          {label}
        </p>
        <div className={clsx('w-full', inputWrapperClass)}>
          {!viewOnly && (
            <input
              ref={ref}
              className={clsx(
                'max-w-[320px] rounded-[4px] text-sm py-[9px] text-text-black  px-3 bg-white border-solid border-[1px] border-gray-1 w-full min-h-[40px]  placeholder-main placeholder:text-[14px] placeholder:leading-[22px] placeholder:tracking-[0.07px]',
              )}
              onChange={onChange}
              value={value}
              name={name}
            ></input>
          )}
          {!!error && !viewOnly && (
            <p className="text-xs text-red-600">{error}</p>
          )}
          {viewOnly && (
            <p
              className={clsx(
                ' max-w-[320px]  text-sm py-[9px]  px-3  text-text-black bg-white w-full min-h-[40px]  placeholder-main placeholder:text-[14px] placeholder:leading-[22px] placeholder:tracking-[0.07px]',
              )}
            >
              {value}
            </p>
          )}

          {!!descriptions.length && !viewOnly && (
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
