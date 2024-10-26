'use client';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CLSX from 'clsx';
import Image from 'next/image';
import { ICONS } from '@/app/assets/icons';

interface PaginationProps {
  total: number;
  pageSize: number;
  indexCurrent: number;
  setIndexCurrent: Dispatch<SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({
  total,
  pageSize,
  indexCurrent,
  setIndexCurrent,
}) => {
  const [totalPage, setTotalPage] = useState<number>(0);
  const [pageArray, setPageArray] = useState<number[]>([]);
  function getNumbersAroundX(n: number, x: number) {
    const result = [];
    if (x > 3) result.push(1);
    if (x > 4) result.push(-1);
    for (let i = x - 2; i <= x + 2; i++) {
      if (i >= 1 && i <= n) result.push(i);
    }
    if (x < n - 3) result.push(-2);
    if (x < n - 2) result.push(n);
    setPageArray(result);
  }
  useEffect(() => {
    setTotalPage(Math.ceil(total / pageSize));
  }, [total, pageSize]);
  useEffect(() => {
    getNumbersAroundX(totalPage, indexCurrent);
  }, [totalPage, indexCurrent]);
  return (
    <div className="flex">
      <div
        className={CLSX(
          'w-full h-full cursor-pointer rounded justify-start items-start inline-flex border border-[#CFCFCF] gap-[10px] mr-2',
          {
            'bg-[#F5F5F5] pointer-events-none	': indexCurrent === 1,
            'bg-[#FFFFFF]': indexCurrent !== 1,
          },
        )+' pad-6'}
        onClick={() => {
          setIndexCurrent(1);
        }}
      >
        <div className="w-3 h-3 relative rotate-180">
          <Image alt="FIRST" src={ICONS.LAST} />
        </div>
      </div>
      <div
        className={CLSX(
          'w-full h-full cursor-pointer mr-3 rounded justify-start items-start inline-flex border border-[#CFCFCF] gap-[10px]',
          {
            'bg-[#F5F5F5] pointer-events-none	': indexCurrent === 1,
            'bg-[#FFFFFF]': indexCurrent !== 1,
          },
        )+' pad-6'}
        onClick={() => {
          setIndexCurrent(indexCurrent - 1);
        }}
      >
        <div className="w-3 h-3 relative rotate-180">
          <Image alt="PREV" src={ICONS.NEXT} />
        </div>
      </div>
      {pageArray.map((pageNumber, key) =>
        pageNumber > 0 ? (
          <div
            key={pageNumber}
            className={CLSX(
              'mx-1 cursor-pointer rounded justify-start items-start inline-flex border border-[#CFCFCF] gap-[10px]',
              {
                'bg-[#61876E] text-white pointer-events-none	':
                  indexCurrent === pageNumber,
                'bg-[#FFFFFF]': indexCurrent !== pageNumber,
              },
            )+' pad-6'}
            onClick={() => {
              setIndexCurrent(pageNumber);
            }}
          >
            <div className="w-3 h-3 relative flex justify-center items-center text-[11px] pad-6">
              {pageNumber}
            </div>
          </div>
        ) : (
          <div
            key={pageNumber}
            className="w-full h-full cursor-pointer pt-2 pb-1 flex-col justify-center items-center inline-flex mx-2 pad-6"
          >
            <div className="text-gray-900 text-sm font-normal leading-3">…</div>
          </div>
        ),
      )}
      <div
        className={CLSX(
          'w-full h-full cursor-pointer ml-3 rounded justify-start items-start inline-flex border border-[#CFCFCF] gap-[10px] mr-2',
          {
            'bg-[#F5F5F5] pointer-events-none	': indexCurrent === totalPage,
            'bg-[#FFFFFF]': indexCurrent !== totalPage,
          },
        )+' pad-6'}  
        onClick={() => {
          setIndexCurrent(indexCurrent + 1);
        }}
      >
        <div className="w-3 h-3 relative">
          <Image alt="NEXT" src={ICONS.NEXT} />
        </div>
      </div>
      <div
        className={CLSX(
          'w-full h-full cursor-pointer rounded justify-start items-start inline-flex border border-[#CFCFCF] gap-[10px]',
          {
            'bg-[#F5F5F5] pointer-events-none	': indexCurrent === totalPage,
            'bg-[#FFFFFF]': indexCurrent !== totalPage,
          },
        )+' pad-6'}  
        onClick={() => {
          setIndexCurrent(totalPage);
        }}
      >
        <div className="w-3 h-3 relative">
          <Image alt="LAST" src={ICONS.LAST} />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
