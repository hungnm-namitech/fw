'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
import OrderListSearchCombo from '../OrderListSearchCombo';
import clsx from 'clsx';
import SupplierOrderResponseModal from '../SupplierOrderResponseModal';
import Loader from '@/app/components/Loader';
import { useAppSelector } from '@/app/store';
import { selectMe } from '@/app/selectors/auth';

interface OrderListHandlerProps {
  session: string;
  role?: USER_ROLE;
  showResponseButton?: boolean;
}

export default function OrderListHandlerSupplier({
  session,
  showResponseButton = false,
  role,
}: OrderListHandlerProps) {
  const form = useForm();
  const {
    register,
    formState: { errors },
    control,
  } = form;
  const watchAllFields = useWatch({ control });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('');
  const [orders, setOrders] = useState<any>([]);
  const [sortDir, setSortDir] = useState<SORT_STATUS>(SORT_STATUS.DESC);
  const [showMore, setShowMore] = useState<boolean>(false);

  const { data: me } = useAppSelector(selectMe);

  const [openResponseModal, setOpenResponseModal] = useState(false);

  const [selected, setSelected] = useState<{ [k: string]: boolean }>({});

  const hasAnySelectedRow = useMemo(
    () => !!Object.values(selected).filter(s => s).length,
    [selected],
  );

  const { data: companies, isLoading: isLoadingCompanies } = useSWR(
    'all-companies',
    () => Companies.all(session),
  );
  const {
    data: itemGroups,
    error,
    isLoading: isLoadingItemGroups,
  } = useSWR('item-group-names', () => ItemGroupApi.allName(session || ''));

  const { data: data, isLoading } = useSWRImmutable(
    ['order-list', watchAllFields, currentPage, sortBy, sortDir],
    () => {
      if (!currentPage) {
        setCurrentPage(1);
        return;
      }

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

      const companiesCd =
        (watchAllFields?.companyCds &&
          watchAllFields?.companyCds
            .map((item: any) => {
              return item.value;
            })
            .join(',')) ||
        '';

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
        requestedDeadlineTo: formatDateFilterToISOString(
          watchAllFields.requestedDeadlineTo,
        ),
        requestedDeadlineFrom: formatDateFilterToISOString(
          watchAllFields.requestedDeadlineFrom,
        ),
        companyCds: companiesCd,
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
  }, [data, isLoading]);
  if (isLoadingCompanies || isLoadingItemGroups) return <Loader />;

  return (
    <>
      <div className="h-full overflow-auto  w-full bg-white flex flex-col !font-noto-sans-jp">
        <div className="h-[30px] w-full mt-[16px] pr-[17px] mb-[12px] pl-6 flex justify-between	">
          <div className="text-gray-900 text-2xl font-bold leading-7">
            発注一覧
          </div>
        </div>
        <div className="w-full px-6 h-[2px]">
          <div className="w-full h-full bg-[#CAD5DB]"></div>
        </div>
        <div>
          {!!companies && !!itemGroups && (
            <OrderListSearchCombo
              companies={companies}
              form={form}
              itemGroups={itemGroups}
              setShowMore={setShowMore}
              showMore={showMore}
              role={role}
            />
          )}
        </div>
        {data && (
          <>
            <OrderListTable
              orders={orders}
              setSortBy={setSortBy}
              setSortDir={setSortDir}
              sortBy={sortBy}
              sortDir={sortDir}
              selected={selected}
              onChange={(id, s) => {
                setSelected(oldSelected => ({ ...oldSelected, [id]: s }));
              }}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              role={me?.roleDiv || 0}
              hideSelectBox={!showResponseButton}
            />

            {showResponseButton && (
              <>
                <div className="flex justify-center mt-[10px] mb-[11px] w-full">
                  <button
                    onClick={() => setOpenResponseModal(true)}
                    disabled={!hasAnySelectedRow}
                    className={clsx({
                      'flex items-center gap-[20px] border-[1px]  border-solid rounded-[2px] py-[6px] px-[12px]':
                        true,
                      'border-primary': hasAnySelectedRow,
                      'border-[#d3d3d3] bg-[#d3d3d3] cursor-not-allowed':
                        !hasAnySelectedRow,
                    })}
                  >
                    <Image src={ICONS.PLUS_SQUARE} alt="plus square" />{' '}
                    <span
                      className={clsx({
                        'text-sm font-bold font-noto-sans-jp ': true,
                        'text-primary': hasAnySelectedRow,
                        'text-gray': !hasAnySelectedRow,
                      })}
                    >
                      希望納期通りに回答をする
                    </span>
                  </button>
                </div>

                <SupplierOrderResponseModal
                  handleClose={() => setOpenResponseModal(false)}
                  open={openResponseModal}
                  selected={selected}
                  setCurrentPage={setCurrentPage}
                  setSelected={setSelected}
                />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
