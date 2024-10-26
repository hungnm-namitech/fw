import clsx from 'clsx';
import Image from 'next/image';
import React, { ChangeEvent, useCallback, useRef } from 'react';

export interface FileUploadButtonProps {
  id: string;
  label: string;
  icon: string;
  onUpload?: (event: ChangeEvent<HTMLInputElement>) => void;
  labelClassName?: string;
  className?: string;
  accepts?: string[];
}

export const FileUpdateButton: React.FC<FileUploadButtonProps> = ({
  id,
  label,
  icon,
  onUpload,
  className,
  labelClassName,
  accepts,
}) => {
  const ref = useRef<HTMLInputElement | null>(null);

  const clearValue = useCallback(() => {
    if (ref.current) {
      ref.current.value = '';
    }
  }, []);

  return (
    <div>
      <input
        ref={ref}
        accept={accepts?.join(',') || undefined}
        onChange={onUpload}
        id={id}
        type="file"
        hidden
        onClick={clearValue}
      />
      <label
        htmlFor={id}
        className={clsx(
          'flex items-center border-[1px] rounded-0.5 border-solid pt-[5px] pb-[6px] pl-4 pr-5 w-fit h-[31px]',
          labelClassName,
        )}
      >
        <Image className="w-[20px] h-[20px]" src={icon} alt={label} />
        <p
          className={clsx(
            'ml-1 text-sm font-bold leading-[20px] font-noto-sans-jp ',
            className,
          )}
        >
          {label}
        </p>
      </label>
    </div>
  );
};
