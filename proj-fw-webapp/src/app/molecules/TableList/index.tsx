import { ICONS } from '@/app/assets/icons';
import { Button } from '@/app/components/Button';
import { User } from '@/app/types/entities';
import { SORT_STATUS } from '@/lib/constants';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useState } from 'react';
import './style.scss';

interface TableListProps {
  columns: IColumnProps[];
  dataRows: User[];
  sortBy?: string;
  sortDir?: SORT_STATUS;
  setSortBy?: React.Dispatch<React.SetStateAction<string>>;
  setSortDir?: React.Dispatch<React.SetStateAction<SORT_STATUS>>;
  setClickCount?: React.Dispatch<React.SetStateAction<any>>;
  clickCount?: any;
  headerFreeze?: boolean;
  headerClassName?: string;
}
export interface IColumnProps {
  title: string;
  key: string;
  sortKey?: string;
  isSort?: boolean;
  hide?: boolean;
  className?: string;
}

const TableList: React.FC<TableListProps> = ({
  columns,
  dataRows,
  sortBy,
  sortDir,
  setSortBy,
  setSortDir,
  headerFreeze,
  headerClassName,
}) => {
  const [clickCount, setClickCount] = useState<any>({});
  return (
    <table className="w-full min-w-max table-auto text-left relative ">
      <thead
        className={clsx(
          {
            'sticky top-0 z-20': headerFreeze,
          },
          headerClassName,
        )}
      >
        <tr>
          {columns.map(head => (
            <th
              key={head.sortKey || head.key}
              className={clsx(
                'border-b border-blue-gray-100 bg-[#F5F7F8] h-9 pl-3 cursor-pointer ',
                {
                  'border-r-2': head.key === 'userId',
                },
              )}
              onClick={() => {
                if (!head.isSort) return;
                const newSortColumn = head.sortKey || head.key;
                setClickCount((prevClickCount: any) => {
                  const updatedClickCount: { [key: string]: number } = {
                    ...Object.fromEntries(
                      Object.entries(prevClickCount).map(([key]) => [key, 0]),
                    ),
                    [newSortColumn]: (prevClickCount[newSortColumn] || 0) + 1,
                  };

                  return updatedClickCount;
                });

                if (clickCount[newSortColumn] === 2) {
                  setSortBy && setSortBy('');
                  setSortDir && setSortDir(SORT_STATUS.DESC);
                  setClickCount?.(
                    (prevClickCount: any) =>
                      ({
                        ...prevClickCount,
                        [newSortColumn]: 0,
                      }) || undefined,
                  );
                } else {
                  setSortBy && setSortBy(head.sortKey || head.key);
                  setSortDir &&
                    setSortDir(
                      sortDir === SORT_STATUS.DESC
                        ? SORT_STATUS.ASC
                        : SORT_STATUS.DESC,
                    );
                }
              }}
            >
              <p
                className={clsx(
                  'text-gray-900 text-sm font-normal leading-5 flex tracking-[0.07px]',
                  head.className,
                )}
              >
                {head.title}
                {head.isSort && (
                  <Image
                    alt="FIRST"
                    className={clsx('', {
                      'opacity-100': sortBy === (head.sortKey || head.key),
                      'opacity-25	': Boolean(
                        sortBy !== (head.sortKey || head.key),
                      ),
                    })}
                    src={
                      sortDir === SORT_STATUS.DESC ||
                      sortBy !== (head.sortKey || head.key)
                        ? ICONS.SORT_ARROW
                        : ICONS.SORT_ARROW_ROTATED
                    }
                  />
                )}
              </p>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataRows.map(row => {
          const classes = 'pl-3 border-b border-blue-gray-50 h-[42px] ';
          const tempFlag = row['temporaryFlag' as keyof typeof row];
          return (
            <tr key={row?.mUserId} className={tempFlag ? ' bg-color-temporary ' : ''}>
              {columns.map(head => (
                <td
                  className={clsx(classes, {
                    'border-r-2': head.key === 'userId',
                  })}
                  key={
                    row[head.key as keyof typeof row] + head.key + row?.mUserId
                  }
                >
                  {head.key === 'orderNo' ? (
                    <Button
                    className="bg-white !text-[#2A74AA] text-sm font-normal leading-5"
                    href={`/orders/${row[head.key as keyof typeof row]}`}
                    >
                      {row[head.key as keyof typeof row]}
                    </Button>
                  ) : (
                    <div className="text-[#222222] text-sm font-normal leading-5">
                      {row[head.key as keyof typeof row]}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TableList;
