import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';
import ReactDatePicker, {
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ICONS } from '../assets/icons';
import ja from 'date-fns/locale/ja';

registerLocale('ja', ja);
interface DatePicker extends ReactDatePickerProps {
  label?: string;
  labelClassName?: string;
  classname?: string;
  error?: string;
}

export function DatePicker({
  label,
  labelClassName,
  error,
  classname,
  ...rest
}: DatePicker) {
  return (
    <div>
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
      <div className="mt-1 border-[1px] rounded-1.5 border-[#667080] border-solid relative">
        <ReactDatePicker
          className={clsx(
            'w-full pt-[13px] pb-3 px-3 bg-transparent text-[#667080] leading-[22px] text-md',
            classname,
          )}
          autoComplete="off"
          id={label}
          wrapperClassName="w-full"
          {...rest}
          locale={ja}
        />
        <label
          className="absolute top-[50%] right-[11px] translate-y-[-50%] "
          htmlFor={label}
        >
          <Image src={ICONS.CHEVRON_DOWN} alt="Chevron down" />
        </label>
      </div>

      {!!error && (
        <p className="text-xs text-red-600" data-error="error">
          {error}
        </p>
      )}
    </div>
  );
}
