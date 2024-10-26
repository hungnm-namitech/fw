'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/Button';
import { ICONS } from '@/app/assets/icons';
import { useForm, useWatch } from 'react-hook-form';
import { SORT_STATUS, USER_ROLE } from '@/lib/constants';
import useSWRImmutable from 'swr';
import * as Orders from '@/app/api/entities/orders';
import useSWR from 'swr';
import * as ItemGroupApi from '@/app/api/entities/itemsGroups';
import * as Companies from '@/app/api/entities/companies';
import OrderListTable from '../OrderListTable';
import { formatDateFilterToISOString } from '@/app/utils/common';
import Loader from '@/app/components/Loader';
import OrderListSearchCombo from '../OrderListSearchCombo';

interface OrderListHandlerProps {
  session: string;
  role?: USER_ROLE;
}

export default function OrderListHandlerPC({
  session,
  role,
}: OrderListHandlerProps) {
  const form = useForm();
  const { control } = form;
  const [orders, setOrders] = useState<any>([]);
  const watchAllFields = useWatch({ control });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDir, setSortDir] = useState<SORT_STATUS>(SORT_STATUS.DESC);
  const [showMore, setShowMore] = useState<boolean>(false);
  const { data: companies, isLoading: isCompaniesLoading } = useSWR(
    'companies',
    () => Companies.all(session),
  );

  const {
    data: itemGroups,
    error,
    isLoading: isLoadingItemGroups,
  } = useSWR('item-group-names', () => ItemGroupApi.allName(session || ''));
  const { data: data, isLoading } = useSWRImmutable(
    [watchAllFields, currentPage, sortBy, sortDir],
    () => {
      const itemCds = (watchAllFields.itemDetail || [])
        .map((i: any) => i.value)
        .join(',');

      delete watchAllFields.itemDetail;
      const statuses = Object.keys(watchAllFields).filter(statusesKey => {
        return statusesKey.includes('statuses') && watchAllFields[statusesKey];
      });
      statuses.forEach(key => {
        delete watchAllFields[key];
      });
      return Orders.getList(session || '', {
        ...watchAllFields,
        statuses: statuses
          .join(',')
          .replaceAll('statuses-', '')
          .replaceAll('-', ','),
        itemCds,
        createAtTo: formatDateFilterToISOString(watchAllFields.createAtTo),
        createAtFrom: formatDateFilterToISOString(watchAllFields.createAtFrom),
        replyDeadlineFrom: formatDateFilterToISOString(
          watchAllFields.replyDeadlineFrom,
        ),
        replyDeadlineTo: formatDateFilterToISOString(
          watchAllFields.replyDeadlineTo,
        ),
        updateAtTo: formatDateFilterToISOString(watchAllFields.updateAtTo),
        updateAtFrom: formatDateFilterToISOString(watchAllFields.updateAtFrom),
        requestedDeadlineTo: formatDateFilterToISOString(
          watchAllFields.requestedDeadlineTo,
        ),
        requestedDeadlineFrom: formatDateFilterToISOString(
          watchAllFields.requestedDeadlineFrom,
        ),
        offset: currentPage - 1,
        sortBy: sortBy,
        sortDir: sortDir,
      });
    },
    {
      onError: err => {
        console.log(err);
      },
      suspense: false,
      fallbackData: { items: [], currentPage: 0, perPage: 0, total: 0 },
    },
  );

  useEffect(() => {
    if (!isLoading) {
      setOrders(data);
    }
  }, [data]);
  if (isCompaniesLoading) return <Loader />;

  return (
    <>
      <div className="h-full w-full bg-white flex flex-col !font-noto-sans-jp">
        <div className="h-[30px] w-full mt-[16px] pr-[17px] mb-[12px] pl-6 flex justify-between	">
          <div className="text-gray-900 text-2xl font-bold leading-7">
            発注一覧
          </div>
          <Button
            type="submit"
            color={'primary'}
            className="!px-[16px] !py-[5px] !w-fit !min-h-[30px]"
            href="/item-groups"
          >
            <div className="text-[14px] w-fit leading-5 flex h-[20px]">
              <Image alt="User" src={ICONS.ADD} className="" />
              新規発注
            </div>
          </Button>
        </div>
        <div className=" w-full px-6 h-[2px]">
          <div className="w-full h-full bg-[#CAD5DB]"></div>
        </div>
        <div className="">
          {!!itemGroups && !!companies && (
            <OrderListSearchCombo
              companies={companies}
              form={form}
              itemGroups={itemGroups}
              setShowMore={setShowMore}
              showMore={showMore}
              hideFields={{ companyCds: true }}
              role={role}
            />
          )}
        </div>
        {data && (
          <OrderListTable
            hideSelectBox
            role={USER_ROLE.PC}
            setSortDir={setSortDir}
            setSortBy={setSortBy}
            sortBy={sortBy}
            sortDir={sortDir}
            orders={orders}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </>
  );
}
