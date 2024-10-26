import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FieldValues, UseFormSetValue } from 'react-hook-form';
import { ICONS } from '../assets/icons';
import clsx from 'clsx';
import { SelectionCommercialForm } from '@/app/molecules/SelectionCompaniesModal';

export type DataOfCompanies = {
  label: string;
  value: SelectionCommercialForm;
};

interface SelectSearch {
  data: Array<DataOfCompanies>;
  field: {
    value: string;
    onChange: UseFormSetValue<FieldValues>;
  };
  error: string;
}

export const SelectSearch = ({ data, field, error, ...rest }: SelectSearch) => {
  const [dataCompanies, setDataCompanies] = useState<any>([]);
  const [inputValue, setInputValue] = useState('');
  const [selected, setSelected] = useState('');
  const [open, setOpen] = useState(false);
  const selectSearchRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setDataCompanies(data);
  }, [data]);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        selectSearchRef.current &&
        !selectSearchRef.current.contains(e.target as Element | null)
      ) {
        setOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  });
  return (
    <div className="font-medium w-full" ref={selectSearchRef}>
      <div
        onClick={() => setOpen(!open)}
        className={clsx(
          'bg-white w-full px-3 py-[14px] cursor-pointer relative border rounded',
          {
            'text-[#8F8F8F]': !selected,
          },
        )}
      >
        {selected ? (
          selected?.length > 25 ? (
            selected?.substring(0, 25) + '...'
          ) : (
            selected
          )
        ) : (
          <div>〇〇を選択してください</div>
        )}
        <Image
          className="absolute top-[50%] translate-y-[-50%] right-[10.2px] w-[15px]"
          src={ICONS.AROW_DROP}
          alt="Chevron down"
        />
      </div>
      <ul
        className={clsx(
          'bg-white',
          'border-0',
          'shadow-lg',
          'mt-2',
          'rounded-[2px]',
          'overflow-hidden',
          'overflow-y-auto',
          'absolute',
          'top-[63%]',
          'w-full',
          'max-w-[360px]',
          'left-[50%]',
          'translate-x-[-50%]',
          {
            'max-h-[215px] border': open,
            'max-h-0': !open,
          },
        )}
      >
        <div className="sticky top-0 !z-50 bg-white py-3 px-2 border-b-[1px] border-solid border-[#EEE]">
          <div className="flex items-center gap-2 border rounded-1 p-2">
            <Image className="w-[20px]" src={ICONS.SEARCH} alt="Chevron down" />
            <input
              {...rest}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value.toLowerCase())}
              placeholder="キーワードを入力"
              className="placeholder:text-gray-700 outline-none font-noto-sans-jp text-[14px] font-[500] w-full"
            />
          </div>
        </div>

        {data &&
          data?.map((company: any, index: number) => (
            <li
              key={index}
              className={clsx('p-3', 'text-sm', {
                'hover:bg-sky-600': true,
                'hover:text-white': true,
                'border-b-[1px] border-solid border-[#EEE]':
                  index !== dataCompanies.length - 1,
                'bg-sky-600 text-white':
                  company?.label?.toLowerCase() === selected?.toLowerCase(),
                block: company?.label?.toLowerCase().startsWith(inputValue),
                hidden: !company?.label?.toLowerCase().startsWith(inputValue),
              })}
              onClick={() => {
                if (company?.label?.toLowerCase() !== selected.toLowerCase()) {
                  setSelected(company?.label);
                  setOpen(false);
                  setInputValue('');
                  field.onChange(company?.value, null);
                }
              }}
            >
              {company?.label}
            </li>
          ))}
      </ul>
      {error && (
        <p className="text-xs absolute -z-10 top-[100%] text-red-600">
          職種を選択してください
        </p>
      )}
    </div>
  );
};

export default SelectSearch;
