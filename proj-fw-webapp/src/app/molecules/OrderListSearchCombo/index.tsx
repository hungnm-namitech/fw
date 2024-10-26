'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { ICONS } from '@/app/assets/icons';
import FormSearch, { SearchFieldProps } from '../FormSearch';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { FIELD_TYPE, USER_ROLE } from '@/lib/constants';
import { Company, ItemGroup } from '@/app/types/entities';
import {
  statusListPC as statusList,
  statusListAdmin,
  statusListSupp,
} from '../OrderListHandlerPC/items';
import './style.scss';
import { useSession } from 'next-auth/react';

interface OrderListHandlerProps {
  itemGroups: ItemGroup[];
  companies: Company[];
  showMore: boolean;
  setShowMore: React.Dispatch<boolean>;
  form: UseFormReturn<any>;
  hideFields?: {
    companyCds?: boolean;
  };
  role?: number;
}

export default function OrderListSearchCombo({
  itemGroups,
  setShowMore,
  showMore,
  form,
  companies,
  hideFields,
  role,
}: OrderListHandlerProps) {
  const statusRole = useMemo(() => {
    switch (role) {
      case USER_ROLE.ADMIN:
        return statusListAdmin;
      case USER_ROLE.PC:
        return statusList;
      case USER_ROLE.SUPPLIER:
        return statusListSupp;
      default:
        return statusListAdmin;
    }
  }, [role]);
  const {
    register,
    formState: { errors },
    control,
    watch,
    setValue,
  } = form;
  const watchAllFields = useWatch({ control });

  const handleUncheckAll = () => {
    searchFieldsCheckbox.map((item: any) => {
      if (item.inputType === FIELD_TYPE.CHECKBOX) {
        setValue(item.name, false);
      }
    })
  };
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const createFormSearch: any = (statusList: any) =>
  statusList
    ?.map((item: any) => {
      return {
        label: item.label,
        inputType: FIELD_TYPE.CHECKBOX,
        ...register(`statuses-${item.id}`,  { value: item.id !== '10' }),
        name: `statuses-${item.id}`,
        classname: 'text-text-black font-noto-sans-jp',
        // classname: 'w-[196px]',
      };
    });

  const searchFieldsCheckbox = useMemo(() => {
    return createFormSearch(statusRole);
  }, [createFormSearch, statusRole]);

  const searchFields: SearchFieldProps[] = useMemo(() => {
    const fields = [
      {
        label: '回答納期日付',
        inputType: FIELD_TYPE.DATE_PICKER,
        classfield: 'w-40 mx-2 mt-1.5',
        placeholderText: 'yy年m月d日(曜日)',
        className:
          '!text-[12px]  leading-[22px] pt-[5px] pb-[5px] pl-[12px]  !w-full !rounded-[5px]',
        ...register('replyDeadlineFrom'),
        name: 'replyDeadlineFrom',
        error: errors?.answerDeliveryFrom?.message?.toString(),
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
        classfield: 'w-40 mx-2 mt-1.5',
        placeholderText: 'yy年m月d日(曜日)',
        className:
          '!text-[12px]  leading-[22px] pt-[5px] pb-[5px] pl-[12px]  !w-full !rounded-[5px]',
        ...register('replyDeadlineTo'),
        name: 'replyDeadlineTo',
        error: errors?.answerDeliveryTo?.message?.toString(),
        control: control,
        minDate: watchAllFields?.replyDeadlineFrom,
      },

      {
        label: '希望納期日付',
        inputType: FIELD_TYPE.DATE_PICKER,
        classfield: 'w-40 mx-2 mt-1.5',
        placeholderText: 'yy年m月d日(曜日)',
        className:
          '!text-[12px]  leading-[22px] pt-[5px] pb-[5px] pl-[12px]  !w-full !rounded-[5px]',
        ...register('requestedDeadlineFrom'),
        name: 'requestedDeadlineFrom',
        error: errors?.desiredDeliveryFrom?.message?.toString(),
        control: control,
        maxDate: watchAllFields?.requestedDeadlineTo,
      },
      {
        content: (
          <div className="text-gray-900 text-sm font-normal leading-5 mt-[42px] ">
            〜
          </div>
        ),
        inputType: FIELD_TYPE.DIV,
      },
      {
        label: '',
        inputType: FIELD_TYPE.DATE_PICKER,
        classfield: 'w-40 mx-2 mt-1.5',
        placeholderText: 'yy年m月d日(曜日)',
        ...register('requestedDeadlineTo'),
        className:
          '!text-[12px]  leading-[22px] pt-[5px] pb-[5px] pl-[12px] !w-full !rounded-[5px]',
        name: 'requestedDeadlineTo',
        error: errors?.desiredDeliveryTo?.message?.toString(),
        control: control,
        minDate: watchAllFields?.requestedDeadlineFrom,
      },
    ];

    if (!hideFields?.companyCds) {
      fields.unshift({
        label: '顧客名',
        inputType: FIELD_TYPE.COMBO_BOX,
        classfield: 'w-40 mx-2 mt-1.5 customer-combo-box text-[13px] my-select',
        placeholder: '顧客名',
        ...register('companyCds'),
        name: 'companyCds',
        error: errors?.companyCds?.message?.toString(),
        control: control,
        isMulti: true,
        options: companies.map((item: Company) => {
          return { label: item.companyName, value: item.id.toString() };
        }),
      } as any);
    }

    return fields;
  }, [watchAllFields, hideFields, companies, control]);
  const searchFieldsShowMore: SearchFieldProps[] = [
    {
      label: 'アイテム名',
      inputType: FIELD_TYPE.COMBO_BOX,
      classfield: 'w-40 mx-2 mt-1.5 text-[13px] my-select',
      placeholder: 'アイテム名',
      className: '!text-[14px]',

      ...register('itemDetail'),
      name: 'itemDetail',
      error: errors?.itemDetail?.message?.toString(),
      control: control,
      isMulti: true,
      options: itemGroups?.map((item: ItemGroup) => {
        return { label: item.itemName, value: item.id };
      }),
    },
    {
      label: '登録日付',
      inputType: FIELD_TYPE.DATE_PICKER,
      classfield: ' w-40 !text-[12px] mx-2 mt-1.5',
      className:
        '!text-[12px]  leading-[22px] pt-[5px] pb-[5px] pl-[12px]  !w-full !rounded-[5px]',
      placeholderText: 'yy年m月d日(曜日)',
      ...register('createAtFrom'),
      name: 'createAtFrom',
      error: errors?.registrationDateFrom?.message?.toString(),
      control: control,
      maxDate: watchAllFields?.createAtTo,
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
      classfield: ' w-40 !text-[12px] mx-2 mt-1.5',
      className:
        '!text-[12px]  leading-[22px] pt-[5px] pb-[5px] pl-[12px]  !w-full !rounded-[5px]',

      placeholderText: 'yy年m月d日(曜日)',
      ...register('createAtTo'),
      name: 'createAtTo',
      error: errors?.registrationDateTo?.message?.toString(),
      control: control,
      minDate: watchAllFields?.createAtFrom,
    },

    {
      label: '更新日付',
      inputType: FIELD_TYPE.DATE_PICKER,
      classfield: ' w-40 !text-[12px] mx-2 mt-1.5',
      className:
        '!text-[12px]  leading-[22px] pt-[5px] pb-[5px] pl-[12px]  !w-full !rounded-[5px]',

      placeholderText: 'yy年m月d日(曜日)',
      ...register('updateAtFrom'),
      name: 'updateAtFrom',
      error: errors?.updateDateFrom?.message?.toString(),
      control: control,
      maxDate: watchAllFields?.updateAtTo,
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
      classfield: ' w-40 !text-[12px] mx-2 mt-1.5',
      className:
        '!text-[12px]  leading-[22px] pt-[5px] pb-[5px] pl-[12px]  !w-full !rounded-[5px]',

      placeholderText: 'yy年m月d日(曜日)',
      ...register('updateAtTo'),
      name: 'updateAtTo',
      error: errors?.updateDateTo?.message?.toString(),
      control: control,
      minDate: watchAllFields?.updateAtFrom,
    },
    {
      label: '発注No',
      inputType: FIELD_TYPE.TEXT_INPUT,
      classfield: 'w-80	!text-[13px] mx-2 mt-1.5',
      type: 'number',
      ...register('id'),
      name: 'id',
      error: errors?.id?.message?.toString(),
      control: control,
      className: '!mt-1 !text-[13px] !py-[5px] !min-h-[32px]',
    },
    {
      label: '合積み',
      inputType: FIELD_TYPE.INLINE_SELECT,
      classfield: 'w-28 !text-[13px] mx-2 mt-1.5',

      ...register('mixedLoadingFlag'),
      name: 'mixedLoadingFlag',
      error: errors?.mixedLoadingFlag?.message?.toString(),
      control: control,
      options: [
        {
          label: '全て',
          value: '',
        },
        {
          label: '可',
          value: '1',
        },
        {
          label: '不可',
          value: '0',
        },
      ],
      className: '!mt-1 !text-[13px] !py-[5px] !min-h-[32px] ',
    },
    {
      label: '備考欄',
      inputType: FIELD_TYPE.TEXT_INPUT,
      classfield: 'w-96 !text-[13px] mx-2 mt-1.5 ',
      ...register('memo'),
      name: 'memo',
      error: errors?.memo?.message?.toString(),
      control: control,
      className: '!mt-1 !text-[13px] leading-[22px] pt-[5px] pb-[5px] !min-h-[32px]',
    },
  ];

  return (
    <>
      <form className="order-list-search-combo">
        <div className="flex w-full justify-between ">
          <div className=" w-full">
            <div className="text-gray-900 text-sm font-normal leading-5 mt-[20px] ml-[28px] flex">
              <p>ステータス</p>
              <p>　　　　　</p>
              <div className='pr-[10px]'>
              <a
                href="#"
                onClick={handleUncheckAll}
                className="text-blue-500 text-sm cursor-pointer"
              >
                全てのチェックを外す
              </a>
            </div>
            </div>
            <FormSearch
              searchFields={searchFieldsCheckbox}
              formClassName="!mt-[8px] block grid grid-cols-5 mx-[28px]"
            />
          </div>
          <div className="w-[144px] ">
            <div className="w-full h-full pt-[5px] pb-8 justify-end items-start inline-flex gap-[16] mt-[20px]">
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
                  <Image alt="User" src={ICONS.AROW_DROP_BLUE} className="" />
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
    </>
  );
}
