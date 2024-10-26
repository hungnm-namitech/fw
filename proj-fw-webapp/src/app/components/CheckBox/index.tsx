import { forwardRef, InputHTMLAttributes } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './checkbox.module.scss';

export interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
  classname?: string;
  checkedImage?: string;
}
export const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>(
  ({ label, name, id, classname, checkedImage, ...rest }, ref) => {
    return (
      <label
        className={clsx([
          `text-text-black text-[14px] leading-[150%] tracking-[0.08px] ${
            !rest.disabled && 'cursor-pointer'
          } flex gap-2`,
          classname,
        ])}
        htmlFor={id || label}
      >
        <input
          type={'checkbox'}
          className={clsx([
            'absolute opacity-0 w-0 h-0',
            styles['checkbox__input'],
          ])}
          id={id || label}
          ref={ref}
          {...rest}
          name={name}
        ></input>
        {rest.disabled ? (
          <Image
            width={16}
            height={16}
            src={checkedImage || '/checkbox-disable.svg'}
            alt={'checkbox checked'}
          />
        ) : (
          <>
            {' '}
            <Image
              className={styles['checkbox__icon--checked']}
              width={16}
              height={16}
              src={checkedImage || '/checkbox-checked.svg'}
              alt={'checkbox checked'}
            />
            <Image
              className={styles['checkbox__icon--uncheck']}
              width={16}
              height={16}
              src={'/checkbox-uncheck.svg'}
              alt={'checkbox uncheck'}
            />
          </>
        )}
        {label}
      </label>
    );
  },
);

CheckBox.displayName = 'CheckBox';
