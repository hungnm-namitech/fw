import clsx from 'clsx';
import React from 'react';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller } from 'react-hook-form';

interface ComboBoxProps {
  label?: string;
  labelClassName?: string;
  error?: string;
  control: any;
  name: string;
  options: any;
}

export function ComboBox({
  label,
  labelClassName,
  error,
  control,
  name,
  options,
  ...rest
}: ComboBoxProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, ref } }) => (
        <div>
          {label ? (
            <label
              className={clsx(
                'text-text-black text-[14px] leading-[150%] tracking-[0.07px] font-noto-sans-jp',
                labelClassName,
              )}
              htmlFor={label}
            >
              {label}
            </label>
          ) : (
            <div className="w-1 h-[24px]"></div>
          )}
          <div className="mt-1 border-[1px] rounded-1.5 border-[#CFCFCF] border-solid relative">
            <Select
              {...rest}
              ref={ref}
              options={options}
              classNamePrefix="addl-class"
              value={options?.find((c: any) => c.value === value)}
              onChange={onChange}
            />
          </div>

          {!!error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      )}
    />
  );
}
