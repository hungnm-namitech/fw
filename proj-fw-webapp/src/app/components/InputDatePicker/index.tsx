import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';
import ReactDatePicker, {
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ICONS } from '../assets/icons';
import { Controller } from 'react-hook-form';
import ja from 'date-fns/locale/ja';

registerLocale('ja', ja);
interface InputDatePicker extends ReactDatePickerProps {
  label?: string;
  labelClassName?: string;
  error?: string;
  control: any;
  name?: string;
}

export function InputDatePicker({
  label,
  labelClassName,
  error,
  control,
  name,
  ...rest
}: InputDatePicker) {
  return (
    <Controller
      control={control}
      name={name || ''}
      render={({ field: { onChange, onBlur, value } }) => {
        return (
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
              <div className="w-1 h-[21px]"></div>
            )}
            <div className="mt-1 border-[1px] rounded-1.5 border-[#CFCFCF] border-solid relative ">
              <ReactDatePicker
                className="!h-[40px] w-full pt-[13px] pb-3 px-3 bg-transparent text-[#667080] leading-[22px] text-md rounded-1"
                wrapperClassName="w-full"
                {...rest}
                locale="ja"
                id={name}
                onChange={onChange} // send value to hook form
                onBlur={onBlur} // notify when input is touched/blur
                selected={value}
                // onKeyDown={e => {
                //   if (e.code !== 'Backspace') e.preventDefault();
                // }}
                dateFormat="yy年M月d日(EE)"
              />
              {!value ? (
                <label htmlFor={name} className="cursor-pointer">
                  <Image
                    src={ICONS.CALENDAR}
                    alt="Chevron down"
                    className="absolute top-[50%] right-[11px] translate-y-[-50%] "
                  />
                </label>
              ) : (
                <Image
                  src={'/close-icon.svg'}
                  width={14}
                  height={14}
                  alt="Chevron down"
                  className="absolute cursor-pointer top-[50%] right-[11px] translate-y-[-50%] "
                  onClick={() => {
                    onChange(null);
                  }}
                />
              )}
            </div>

            {!!error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        );
      }}
    />
  );
}
