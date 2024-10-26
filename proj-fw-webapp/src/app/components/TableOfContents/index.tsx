'use client';
import { IDataTable, IListDataTable } from '@/app/types/table-of-content';
import clsx from 'clsx';
import Image from 'next/image';

interface ITableOfContents {
  handleMoveTo: (id: string) => void;
}

export default function TableOfContents({
  dataTable,
  handleMoveTo,
}: IListDataTable & ITableOfContents) {
  return (
    <div className="py-3 px-4  border-[#CAD5DB] border-[1px] border-solid">
      <p>目次</p>
      <div className="mt-1 flex flex-col gap-y-1">
        {dataTable &&
          dataTable.map((item: IDataTable, index: number) => {
            return (
              <div
                key={item.id}
                onClick={() => handleMoveTo(item.id)}
                className={clsx('flex items-center cursor-pointer', {
                  'pb-1 border-border border-b-solid border-b-[1px]':
                    index !== dataTable?.length - 1,
                })}
              >
                <Image
                  src="/icon_arrow_down.svg"
                  className="w-[32px] h-[32px]"
                  width={32}
                  height={32}
                  alt={item.content}
                />
                <p className="text-md font-noto-sans-jp leading-2 tracking-[0.08px] text-text-black">
                  {item.content}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
