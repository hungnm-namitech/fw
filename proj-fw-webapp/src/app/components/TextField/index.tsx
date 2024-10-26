import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Control, FieldValues } from 'react-hook-form';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  action?: JSX.Element;
  name?: string;
  type?: string;
  placeholder?: string;
  placeholderText?: string;
  restProps?: any;
  labelClassName?: string;
  inputType?: number;
  options?: { value: string; label: string }[];
  control?: Control<FieldValues, any>;
  content?: any;
  maxDate?: Date;
  minDate?: Date;
  classDiv?: string;
}
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      error,
      action,
      name,
      type = 'text',
      className,
      labelClassName,
      classDiv,
      ...rest
    },
    ref,
  ) => {
    return (
      <div className={clsx('flex flex-col gap-1 w-full', classDiv)}>
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
        <input
          className={clsx(
            'rounded-[4px] bg-white border-solid border-[1px] border-gray-1 w-full min-h-[40px] py-[9px] leading-[157.143%] text-sm placeholder-main placeholder:text-sm placeholder:leading-[157.143%] placeholder:tracking-[0.07px] ',
            className,
            {
              'px-3': !action,
              'pl-3 pr-[50%]': Boolean(action),
            },
          )}
          id={label}
          ref={ref}
          {...rest}
          type={type}
          name={name}
        ></input>
        <div className={'absolute top-[38px] right-[11px] font-noto-sans-jp'}>
          {action}
        </div>
        {error && (
          <p
            className={'text-red-500 mt-2 font-noto-sans-jp text-[14px] w-full'}
            data-error="error"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
