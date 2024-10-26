'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/Button';
import { ICONS } from '@/app/assets/icons';
import Pagination from '../Pagination';
import TableList, { IColumnProps } from '../TableList';
import { ORDER_STATUS_DIV, SORT_STATUS, USER_ROLE } from '@/lib/constants';
import { formatJapaneseDate } from '@/lib/utilities';
import { ListOrder } from '@/app/types/entities';
import { CheckBox } from '@/app/components/CheckBox';
import { warningReply } from '@/app/utils/orders';
import './style.scss';
import { useSession } from 'next-auth/react';
import OrderStatus from '@/app/molecules/OrderStatus';
import moment from 'moment';
import OrderActionChip from '../OrderActionChip';

interface OrderListHandlerProps {
  orders: ListOrder;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setSortDir: React.Dispatch<React.SetStateAction<SORT_STATUS>>;
  sortBy: string;
  sortDir: SORT_STATUS;
  selected?: { [id: string]: boolean };
  onChange?: (id: string, state: boolean) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  role: number;
  hideSelectBox?: boolean;
}

export default function OrderListTable({
  orders,
  setSortBy,
  setSortDir,
  sortBy,
  sortDir,
  selected = {},
  onChange = () => {},
  currentPage,
  setCurrentPage,
  role,
  hideSelectBox = false,
}: OrderListHandlerProps) {
  const { data: session } = useSession();
  const [element, setElement] = useState<HTMLElement | null>(null);
  const returnReplying = (statusDiv: ORDER_STATUS_DIV) => {
    return (
      session?.user?.role === USER_ROLE.SUPPLIER &&
      !(
        statusDiv == ORDER_STATUS_DIV.CANCELLATION_APPROVED ||
        statusDiv == ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED ||
        statusDiv == ORDER_STATUS_DIV.DELIVERED
      )
    );
  };

  const columns: IColumnProps[] = [
    {
      title: '',
      key: 'selectBox',
      sortKey: '',
      isSort: false,
      hide: hideSelectBox,
    },
    {
      title: '発注No.',
      key: 'idRender',
      sortKey: 'id',
      isSort: true,
      className: 'font-[400] font-noto-sans-jp',
    },
    {
      title: '発注アイテム',
      key: 'itemName',
      isSort: true,
      className: 'font-[400] font-noto-sans-jp pl-3',
    },
    {
      title: '未読',
      key: 'isReadRender',
      sortKey: 'isRead',
      isSort: true,
      className: 'font-[400] font-noto-sans-jp justify-center',
    },
    {
      title: 'ステータス',
      key: 'statusRender',
      sortKey: 'statusDiv',
      isSort: true,
      className: 'font-[400] font-noto-sans-jp justify-center',
    },
    {
      title: 'アクション',
      key: 'actionRender',
      sortKey: 'action',

      isSort: true,
      className: 'font-[400] font-noto-sans-jp justify-center',
    },
    {
      title: '最終更新日時',
      key: 'updatedTime',
      sortKey: 'updatedAt',
      isSort: true,
      className: 'font-[400] font-noto-sans-jp',
    },
    {
      title: '更新者',
      key: 'changer',
      isSort: true,
      className: 'font-[400] font-noto-sans-jp',
    },
    {
      title: '登録日時',
      key: 'createdTime',
      sortKey: 'createdAt',
      isSort: true,
      className: 'font-[400] font-noto-sans-jp',
    },
    {
      title: '希望納期日付',
      key: 'requestedDeadlineTime',
      sortKey: 'requestedDeadline',
      isSort: true,
      className: 'font-[400] font-noto-sans-jp',
    },
    {
      title: '回答納期日付',
      key: 'replyDeadlineTime',
      sortKey: 'replyDeadline',
      isSort: true,
      className: 'font-[400] font-noto-sans-jp',
    },
    {
      title: '発注量',
      key: 'orderQuantity',
      isSort: true,
      className: 'font-[400] font-noto-sans-jp',
    },
    {
      title: '備考欄',
      key: 'memo',
      isSort: true,
      className: 'font-[400] font-noto-sans-jp',
    },
    {
      title: '合積み',
      key: 'mixedLoadingFlagRender',
      sortKey: 'mixedLoadingFlag',
      isSort: true,
      className: 'font-[400] font-noto-sans-jp',
    },
    {
      title: '降ろし場所',
      key: 'purchasingAgent',
      sortKey: 'destinationId',
      isSort: true,
      className: 'font-[400] font-noto-sans-jp',
    },
  ];

  const tableData = useMemo(() => {
    const maxIdLength = orders?.items?.reduce(
      (max, item) => Math.max(max, item.id.toString().length),
      0,
    );
    let w: number | null = null;
    if (element) {
      const widthOfELement = element?.offsetWidth / element?.innerText?.length;
      w = maxIdLength > 5 ? maxIdLength * widthOfELement : null;
    }

    return (
      orders?.items?.map(item => {
        return {
          ...item,
          changer: item.updatedByUserName || '',
          selectBox: (
            <div>
              <CheckBox
                disabled={
                  item.statusDiv != ORDER_STATUS_DIV.DELIVERY_DATE_UNDETERMINED
                }
                checked={selected[item.id]}
                onChange={e => {
                  onChange(item.id, e.currentTarget.checked);
                }}
              />
            </div>
          ),
          itemName: (
            <div className="has-tooltip flex gap-[5.5px] pl-3">
              {(item.tradingCompany !== undefined && item.tradingCompany !== '直接') &&(
                <>
                  <span className="tooltip rounded absolute top-0 -translate-y-full shadow-lg p-[8px] bg-white text-center  min-w-[150px]">
                    {item.tradingCompany}
                  </span>
                  <Image
                    src={ICONS.WARNING_BLACK}
                    width={15}
                    height={15}
                    alt="warning"
                  />
                </>
              )}
              <p className="font-[700]">
                {item.itemName} ({item.supplierName})
              </p>
            </div>
          ),
          memo: <div>{!!item.memo ? '有り' : '無し'}</div>,
          updatedTime: (
            <div className="flex w-fit">
              {formatJapaneseDate(item.updatedAt || '')}
              {moment(item.createdAt).format('H:mm')}
            </div>
          ),
          createdTime: (
            <div className="flex w-fit">
              {formatJapaneseDate(item.createdAt || '')}
              {moment(item.createdAt).format('H:mm')}
            </div>
          ),
          replyDeadlineTime: (
            <div className="flex w-fit">
              {formatJapaneseDate(item.replyDeadline || '')}
            </div>
          ),
          requestedDeadlineTime: (
            <div className="flex w-fit">
              {formatJapaneseDate(item.requestedDeadline || '')}
            </div>
          ),
          action: (
            <div className="flex w-fit">
              <Button
                type="submit"
                className="!w-fit h-[26px] !min-h-[26px] pl-5 pr-5 mr-2 pt-1 pb-1 bg-white rounded justify-center items-center inline-flex border border-[#35433E] !text-[#35433E] "
              >
                <p className="text-[14px] font-noto-sans-jp leading-[17.5px]">
                  編集
                </p>
              </Button>
              <Button
                type="submit"
                className="!w-fit h-[26px] !min-h-[26px] pl-5 pr-5 pt-1 pb-1 bg-[#C53F3F] rounded justify-center items-center inline-flex"
              >
                <p className="text-[14px] font-noto-sans-jp leading-[17.5px]">
                  削除
                </p>
              </Button>
            </div>
          ),
          isReadRender: (
            <>
              <div className="flex justify-center">
                {!item.isRead && (
                  <Image alt="User" src={ICONS.UNREAD_CHECK} className="" />
                )}
              </div>
            </>
          ),
          idRender: (
            <div className="flex ml-[-12px]">
              <Button
                className={
                  item.temporaryFlag
                  ? "bg-color-temporary !text-[#2A74AA] text-sm font-normal leading-5"
                  : "!bg-white !text-[#2A74AA] text-sm font-normal leading-5" 
                }
                href={`/orders/${item.id}${
                  returnReplying(item.statusDiv) ? '/replying-delivery' : ''
                }`}
              >
                <div style={{ minWidth: `${w}px` }} className="text-left">
                  <span
                    className="inline-block text-left"
                    data-element="element"
                  >
                    {item.id.toString().padStart(5, '0')}
                  </span>
                </div>
              </Button>
              {warningReply(
                item.replyDeadline,
                +item.statusDiv,
                session?.user.role as USER_ROLE,
              ) && (
                <div className="has-tooltip flex gap-[5.5px] pl-3">
                  <span className="tooltip rounded absolute top-0 -translate-y-full shadow-lg p-[8px] bg-white text-center  min-w-[150px]">
                      納品済みにしてください
                  </span>
                  <Image
                    alt="warning"
                    width={20}
                    height={20}
                    src={ICONS.WARNING}
                  />
                </div>
              )}
            </div>
          ),
          mixedLoadingFlagRender: (
            <div>{item.mixedLoadingFlag == '0' ? '不可' : '可'}</div>
          ),
          statusRender: (
            <div className="w-full flex justify-center">
              <OrderStatus type={role} statusDiv={+item.statusDiv} />
            </div>
          ),
          actionRender: (
            <>
              <div className="w-full flex justify-center ">
                <OrderActionChip actionDiv={+item.actionDiv as any} />
              </div>
            </>
          ),
          purchasingAgent: (
            <p>{item.change_order_destiantion_name || item.destination_name}</p>
          ),
        };
      }) || []
    );
  }, [orders, element]);

  useEffect(() => {
    const element = document.querySelector('[data-element');
    if (element) {
      setElement(element as HTMLElement);
    }
  }, [orders]);

  return (
    <>
        <div className="h-[25px] w-full mt-[10px] pr-[17px] mb-[10px] pl-6 flex justify-between	">
          <div className="text-gray-900 text-md font-bold leading-normal">
          {`全${orders?.total}件中${orders?.items?.length}件を表示`}
        </div>
        <Pagination
          total={orders?.total || 0}
          pageSize={orders?.perPage || 10}
          indexCurrent={currentPage}
          setIndexCurrent={setCurrentPage}
        />
      </div>

      <div className="min-h-[200px] flex-1 overflow-scroll ml-5 orders-list-table ">
        <TableList
          columns={columns.filter((column: IColumnProps) => !column.hide)}
          dataRows={tableData}
          sortBy={sortBy}
          sortDir={sortDir}
          setSortBy={setSortBy}
          setSortDir={setSortDir}
          headerFreeze
        />
      </div>
    </>
  );
}
