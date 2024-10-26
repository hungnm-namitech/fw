'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/Button';
import { ICONS } from '@/app/assets/icons';
import FormSearch, { SearchFieldProps } from '../FormSearch';
import Pagination from '../Pagination';
import TableList, { IColumnProps } from '../TableList';
import { useForm, useWatch } from 'react-hook-form';
import {
  FIELD_TYPE,
  SORT_STATUS,
  ORDER_ACTION_DIV,
  ORDER_STATUS_DIV,
  USER_ROLE,
} from '@/lib/constants';
import useSWRImmutable from 'swr';
import * as Orders from '@/app/api/entities/orders';
import { formatJapaneseDate } from '@/lib/utilities';
import { statusListPC } from '../OrderListHandlerPC/items';
import {
  getBgStatus,
  getTextColorStatus,
  getTextStatus,
} from '@/app/utils/orders';
import OrderStatus from '../OrderStatus';

interface OrderListHandlerProps {
  session: string;
  role?: USER_ROLE;
}

export default function OrderListHandler({
  session,
  role,
}: OrderListHandlerProps) {
  const {
    register,
    formState: { errors },
    control,
  } = useForm();
  const watchAllFields = useWatch({ control });

  const [orders, setOrders] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDir, setSortDir] = useState<SORT_STATUS>(SORT_STATUS.ASC);
  const [showMore, setShowMore] = useState<boolean>(false);

  const columns: IColumnProps[] = [
    { title: '発注No.', key: 'idRender', sortKey: 'id', isSort: true },
    { title: '発注アイテム', key: 'itemName', isSort: true },
    { title: '未読', key: 'isReadRender', sortKey: 'isRead', isSort: true },
    {
      title: 'ステータス',
      key: 'statusRender',
      sortKey: 'statusDiv',
      isSort: true,
    },
    {
      title: 'アクション',
      key: 'actionRender',
      sortKey: 'action',

      isSort: true,
    },
    {
      title: '最終更新日時',
      key: 'updatedTime',
      sortKey: 'updatedAt',
      isSort: true,
    },
    {
      title: '更新者',
      key: 'changer',
      isSort: true,
    },
    {
      title: '登録日時',
      key: 'createdTime',
      sortKey: 'createdAt',
      isSort: true,
    },
    {
      title: '希望納期日付',
      key: 'requestedDeadlineTime',
      sortKey: 'requestedDeadline',
      isSort: true,
    },
    {
      title: '回答納期日付',
      key: 'replyDeadlineTime',
      sortKey: 'replyDeadline',
      isSort: true,
    },
    {
      title: '発注量',
      key: 'orderQuantity',
      isSort: true,
      hide: !showMore,
    },
    {
      title: '備考欄',
      key: 'memo',
      isSort: true,
      hide: !showMore,
    },
    {
      title: '合積み',
      key: 'mixedLoadingFlagRender',
      sortKey: 'mixedLoadingFlag',
      isSort: true,
      hide: !showMore,
    },
    {
      title: '降ろし場所',
      key: 'purchasingAgent',
      isSort: true,
      hide: !showMore,
    },
  ];

  const statusList = statusListPC;
  const optionsItem = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const createFormSearch: any = (statusList: any) =>
    statusList?.map((item: any) => {
      return {
        label: item.label,
        inputType: FIELD_TYPE.CHECKBOX,
        ...register(item.id, {}),
        name: item.id,
        classname: 'w-[196px]',
      };
    });
  const searchFieldsCheckbox = useMemo(() => {
    return createFormSearch(statusList);
  }, [createFormSearch, statusList]);

  const searchFields: SearchFieldProps[] = [
    {
      label: '回答納期日付',
      inputType: FIELD_TYPE.DATE_PICKER,
      classfield: 'w-44 mx-2 mt-1.5',
      placeholderText: 'yy年m月d日(曜日)',
      ...register('replyDeadlineFrom'),
      name: 'replyDeadlineFrom',
      error: errors?.replyDeadlineFrom?.message?.toString(),
      control: control,
      maxDate: watchAllFields?.replyDeadlineTo,
    },
    {
      content: (
        <div className="text-gray-900 text-sm font-normal leading-5 mt-[42px]">
          〜
        </div>
      ),
      inputType: FIELD_TYPE.DIV,
    },
    {
      label: '',
      inputType: FIELD_TYPE.DATE_PICKER,
      classfield: 'w-44 mx-2 mt-1.5',
      placeholderText: 'yy年m月d日(曜日)',
      ...register('replyDeadlineTo'),
      name: 'replyDeadlineTo',
      error: errors?.replyDeadlineTo?.message?.toString(),
      control: control,
      minDate: watchAllFields?.replyDeadlineFrom,
    },

    {
      label: '希望納期日付',
      inputType: FIELD_TYPE.DATE_PICKER,
      classfield: 'w-44 mx-2 mt-1.5',
      placeholderText: 'yy年m月d日(曜日)',
      ...register('requestedDeadlineFrom'),
      name: 'requestedDeadlineFrom',
      error: errors?.requestedDeadlineFrom?.message?.toString(),
      control: control,
      maxDate: watchAllFields?.requestedDeadlineTo,
    },
    {
      content: (
        <div className="text-gray-900 text-sm font-normal leading-5 mt-[42px]">
          〜
        </div>
      ),
      inputType: FIELD_TYPE.DIV,
    },
    {
      label: '',
      inputType: FIELD_TYPE.DATE_PICKER,
      classfield: 'w-44 mx-2 mt-1.5',
      placeholderText: 'yy年m月d日(曜日)',
      ...register('requestedDeadlineTo'),
      name: 'requestedDeadlineTo',
      error: errors?.requestedDeadlineTo?.message?.toString(),
      control: control,
      minDate: watchAllFields?.requestedDeadlineFrom,
    },
  ];
  const searchFieldsShowMore: SearchFieldProps[] = [
    {
      label: 'アイテム名',
      inputType: FIELD_TYPE.COMBO_BOX,
      classfield: 'w-80 mx-2 mt-1.5',
      placeholder: 'アイテム名',
      ...register('itemDetail'),
      name: 'itemDetail',
      error: errors?.itemDetail?.message?.toString(),
      control: control,
      isMulti: true,
      options: optionsItem,
    },
    {
      label: '登録日付',
      inputType: FIELD_TYPE.DATE_PICKER,
      classfield: 'w-44 mx-2 mt-1.5',
      placeholderText: 'yy年m月d日(曜日)',
      ...register('createdAtFrom'),
      name: 'createdAtFrom',
      error: errors?.createdAtFrom?.message?.toString(),
      control: control,
      maxDate: watchAllFields?.createdAtTo,
    },
    {
      content: (
        <div className="text-gray-900 text-sm font-normal leading-5 mt-[42px]">
          〜
        </div>
      ),
      inputType: FIELD_TYPE.DIV,
    },
    {
      label: '',
      inputType: FIELD_TYPE.DATE_PICKER,
      classfield: 'w-44 mx-2 mt-1.5',
      placeholderText: 'yy年m月d日(曜日)',
      ...register('createdAtTo'),
      name: 'createdAtTo',
      error: errors?.createdAtTo?.message?.toString(),
      control: control,
      minDate: watchAllFields?.createdAtFrom,
    },

    {
      label: '更新日付',
      inputType: FIELD_TYPE.DATE_PICKER,
      classfield: 'w-44 mx-2 mt-1.5',
      placeholderText: 'yy年m月d日(曜日)',
      ...register('updateDateFrom'),
      name: 'updateDateFrom',
      error: errors?.updateDateFrom?.message?.toString(),
      control: control,
      maxDate: watchAllFields?.updateDateTo,
    },
    {
      content: (
        <div className="text-gray-900 text-sm font-normal leading-5 mt-[42px]">
          〜
        </div>
      ),
      inputType: FIELD_TYPE.DIV,
    },
    {
      label: '',
      inputType: FIELD_TYPE.DATE_PICKER,
      classfield: 'w-44 mx-2 mt-1.5',
      placeholderText: 'yy年m月d日(曜日)',
      ...register('updateDateTo'),
      name: 'updateDateTo',
      error: errors?.updateDateTo?.message?.toString(),
      control: control,
      minDate: watchAllFields?.updateDateFrom,
    },
    {
      label: '発注No',
      inputType: FIELD_TYPE.TEXT_INPUT,
      classfield: 'w-80	 mx-2 mt-1.5',
      ...register('id'),
      name: 'id',
      error: errors?.id?.message?.toString(),
      control: control,
      className: '!mt-1',
    },
    {
      label: '合積み',
      inputType: FIELD_TYPE.INLINE_SELECT,
      classfield: 'w-28 mx-2 mt-1.5',
      ...register('mixedLoadingFlag'),
      name: 'mixedLoadingFlag',
      error: errors?.mixedLoadingFlag?.message?.toString(),
      control: control,
      options: [
        {
          label: '可',
          value: '0',
        },
        {
          label: '不可能',
          value: '1',
        },
      ],
      className: '!mt-1',
    },
    {
      label: '備考欄',
      inputType: FIELD_TYPE.TEXT_INPUT,
      classfield: 'w-96 mx-2 mt-1.5',
      ...register('memo'),
      name: 'memo',
      error: errors?.memo?.message?.toString(),
      control: control,
      className: '!mt-1',
    },
  ];

  const { data: data, isLoading } = useSWRImmutable(
    [watchAllFields, currentPage, sortBy, sortDir],
    () =>
      Orders.getList(session || '', {
        ...watchAllFields,
        offset: currentPage - 1,
        sortBy: sortBy,
        sortDir: sortDir,
      }),
    {
      onError: err => {
        console.log(err);
      },
    },
  );
  useEffect(() => {
    setOrders(
      data?.items?.map(item => {
        return {
          ...item,
          memo: <div>{!!item.memo ? '有り' : '無し'}</div>,
          updatedTime: (
            <div className="flex w-fit">
              {formatJapaneseDate(item.updatedAt || '')}
            </div>
          ),
          createdTime: (
            <div className="flex w-fit">
              {formatJapaneseDate(item.createdAt || '')}
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
              {!item.isRead && (
                <Image alt="User" src={ICONS.UNREAD_CHECK} className="" />
              )}
            </>
          ),
          idRender: (
            <>
              <Button
                className="bg-white !text-[#2A74AA] text-sm font-normal leading-5"
                href={`/orders/${item.id}`}
              >
                {item.id}
              </Button>
            </>
          ),
          mixedLoadingFlagRender: (
            <div>{item.mixedLoadingFlag == '0' ? '可' : '不可'}</div>
          ),
          statusRender: (
            <>
              <div
                className={`w-28 h-fit  pl-2 pr-2 justify-center items-center inline-flex rounded-[30px] bg-[${getBgStatus(
                  item.statusDiv,
                )}]`}
              >
                <div
                  className={`text-center text-${getTextColorStatus(
                    item.statusDiv,
                  )} font-normal h-[32px] leading-[32px]`}
                >
                  {getTextStatus(item.statusDiv)}
                </div>
              </div>
            </>
          ),
          actionRender: (
            <>
              {item.action === ORDER_ACTION_DIV.APPROVAL ? (
                <div className="w-28 h-full pt-1 pb-2 pl-2 pr-2 bg-teal-800 justify-center items-center inline-flex rounded-[30px]">
                  <div className="text-center text-white font-normal">承認</div>
                </div>
              ) : (
                <div className="w-28 h-full pt-1 pb-2 pl-2 pr-2 bg-[#CCFFFF] justify-center items-center inline-flex rounded-[30px]">
                  <div className="text-center text-[#171717] font-normal">
                    発注確定
                  </div>
                </div>
              )}
            </>
          ),
        };
      }) || [],
    );
    // if (!data?.total) {
    //   setCurrentPage(1);
    // }
  }, [data]);

  return (
    <>
      <div className="min-h-[calc(100vh-116px)] w-full bg-white flex flex-col !font-noto-sans-jp">
        <div className="h-[30px] w-full mt-[16px] pr-[17px] mb-[12px] pl-6 flex justify-between	">
          <div className="text-gray-900 text-2xl font-bold leading-7">
            発注一覧
          </div>
          <Button
            type="submit"
            color={'primary'}
            className="!px-[16px] !py-[5px] !w-fit !min-h-[30px]"
            href="/orders/new-entry"
          >
            <div className="text-[14px] w-fit leading-5 flex h-[20px]">
              <Image alt="User" src={ICONS.ADD} className="" />
              新規発注
            </div>
          </Button>
        </div>
        <div className="w-full px-6 h-[2px]">
          <div className="w-full h-full bg-[#CAD5DB]"></div>
        </div>
        <div>
          <form>
            <div className="flex w-full">
              <div className="w-[calc(100% - 144px)]">
                <div className="text-gray-900 text-sm font-normal leading-5 mt-[8px] ml-[28px]">
                  ステータス
                </div>
                <FormSearch
                  searchFields={searchFieldsCheckbox}
                  formClassName="!mt-2 mx-[28px]"
                />
              </div>
              <div className="w-[144px]">
                <div className="w-full h-full pt-8 pb-8 justify-end items-start inline-flex gap-[16]">
                  <div
                    className="w-36 flex cursor-pointer"
                    onClick={() => setShowMore(!showMore)}
                  >
                    <div className="left-0 top-0  text-right text-gray-900 text-sm font-bold">
                      {showMore ? '詳細条件を閉じる' : '詳細条件を開く'}
                    </div>
                    <div
                      className={`w-5 h-5 flex-col justify-start items-start inline-flex left-[122px] top-[20px] ${
                        !showMore && 'rotate-180'
                      }`}
                    >
                      <Image
                        alt="User"
                        src={ICONS.AROW_DROP_BLUE}
                        className=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative z-50">
              <FormSearch
                searchFields={searchFields}
                formClassName="!mt-2 mx-[20px]"
              />
              <div className={`${!showMore && 'hidden'}`}>
                <FormSearch
                  searchFields={searchFieldsShowMore}
                  formClassName="!mt-2 mx-[20px] !static"
                />
              </div>
            </div>
          </form>
        </div>
        <div className="h-[25px] w-full mt-[10px] pr-[17px] mb-[10px] pl-6 flex justify-between	">
          <div className="text-gray-900 text-md font-bold leading-normal">
            {`全${data?.total || 0}件中${data?.perPage || 10}件を表示`}
          </div>
          <Pagination
            total={data?.total || 0}
            pageSize={data?.perPage || 10}
            indexCurrent={currentPage}
            setIndexCurrent={setCurrentPage}
          />{' '}
        </div>

        <div className="flex-1 overflow-scroll ml-5">
          {
            <TableList
              columns={columns.filter((column: IColumnProps) => !column.hide)}
              dataRows={orders}
              sortBy={sortBy}
              sortDir={sortDir}
              setSortBy={setSortBy}
              setSortDir={setSortDir}
            />
          }
        </div>
      </div>
    </>
  );
}
