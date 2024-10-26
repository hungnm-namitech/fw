'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/Button';
import { ICONS } from '@/app/assets/icons';
import FormSearch, { SearchFieldProps } from '../FormSearch';
import Pagination from '../Pagination';
import TableList, { IColumnProps } from '../SupplierTableList';
import { useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  FIELD_TYPE,
  ROLES_DIV,
  SORT_STATUS,
  USER_ROLE,
  VALIDATE,
} from '@/lib/constants';
import useSWRImmutable from 'swr';
import * as suppliers from '@/app/api/entities/suppliers';
import { Supplier } from '@/app/types/entities';
import { formatJapaneseDate } from '@/lib/utilities';
import * as Roles from '@/app/api/entities/roles';
import useSWR from 'swr';
import InlineSelect from '@/app/components/InlineSelect';
import Link from 'next/link';
import * as Suppliers from '@/app/api/entities/suppliers';
import { PAGES } from '@/app/constants/common.const';
import 'react-tooltip/dist/react-tooltip.css'

interface SupplierListHandlerProps {
  session: string;
}

export default function SupplierListHandler({ session }: SupplierListHandlerProps) {
  const {
    register,
    formState: { errors },
    control,
  } = useForm();
  const watchAllFields = useWatch({ control });
  // const [supplier, setSuppliers] = useState<Supplier[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDir, setSortDir] = useState<SORT_STATUS>(SORT_STATUS.ASC);

  const searchFields: SearchFieldProps[] = [
    {
      label: 'メーカーID',
      classfield: 'w-60 mx-2 mt-1.5',
      placeholder: '',
      ...register('supplierCd', {
        maxLength: VALIDATE.PHONE_MAX_LENGTH,
      }),
      name: 'supplierCd',
      className: '!h-[40px]',
    },
    {
      label: 'メーカー名',
      classfield: 'w-60 mx-2 mt-1.5',
      placeholder: '',
      ...register('supplierName', {
        maxLength: VALIDATE.NAME_MAX_LENGTH,
      }),
      name: 'supplierName',
      className: '!h-[40px]',
    },
    {
      label: '電話番号',
      classfield: 'w-[280px] mx-2 mt-1.5',
      placeholder: '',
      ...register('tel', {
        maxLength: VALIDATE.PHONE_MAX_LENGTH,
      }),
      name: 'tel',
      className: '!h-[40px]',
    },
    {
      label: '住所',
      classfield: 'w-[280px] mx-2 mt-1.5',
      placeholder: '',
      ...register('address', {
        maxLength: VALIDATE.EMAIL_MAX_LENGTH,
      }),
      name: 'address',
      className: '!h-[40px]',
    },
  ];

  const columns: IColumnProps[] = [
    { title: 'メーカーID', key: 'supplierCd', isSort: true, className: 'w-[100px]' },
    { title: 'メーカー名', key: 'supplierName', isSort: true, className: 'w-[250px]' },
    { title: 'メーカー名（フリガナ）', key: 'supplierNameKana', isSort: true, className: 'w-[250px]' },
    { title: '電話番号', key: 'tel', isSort: true, className: 'w-[120px]' },
    { title: '郵便番号', key: 'postCd', isSort: true, className: 'w-[100px]' },
    { title: '住所', key: 'address', isSort: true, className: 'w-[250px]' },
    { title: '', key: 'action'},
  ];

  const { data: data, isLoading } = useSWRImmutable(
    ['supplier', watchAllFields, currentPage, sortBy, sortDir],
    () =>
      Suppliers.getList(session || '', {
        ...watchAllFields,
        offset: currentPage - 1,
        sortBy: sortBy,
        sortDir: sortDir,
      }),
    {
      onError: err => {
        console.log(err);
      },
      fallbackData: { perPage: 0, currentPage: 0, total: 0, items: [] },
    },
  );

  const suppliers = useMemo(
    () => 
      data?.items?.map(item => {
        return {
          ...item,
          action: (
            <div className="flex w-fit">
              <Button
                type="submit"
                className="!w-fit h-[26px] !min-h-[26px] pl-5 pr-5 mr-2 pt-1 pb-1 bg-white rounded justify-center items-center inline-flex border border-[#35433E] !text-[#35433E] "
                href={`suppliers/${item?.supplierCd}/edit`}
              >
                <p className="text-[14px] font-noto-sans-jp leading-[17.5px]">
                  編集
                </p>
              </Button>
            </div>
          ),
        };
      }) || [],
    [data]
  );

  return (
    <>
      <div className="h-[calc(100vh-116px)] w-full bg-white flex flex-col">
        <div className="h-[30px] w-full mt-[26px] pr-[17px] mb-[17px] pl-6 flex justify-between	">
          <div className="text-gray-900 font-bold leading-[30px] text-[24px]">
            サプライヤ一覧
          </div>
        </div>
        <div className="w-full px-6 h-[2px]">
          <div className="w-full h-full bg-[#CAD5DB]"></div>
        </div>
        <div>
          <form>
            <FormSearch searchFields={searchFields} />
          </form>
        </div>
        <div className="h-[25px] w-full mt-[10px] pr-[17px] mb-[10px] pl-6 flex justify-between	">
          <div className="text-gray-900 text-md font-bold leading-normal">
            {`全${data?.total || 0}件中${
              data?.items.length || 10
            }件を表示`}
          </div>
          <Pagination
            total={data?.total || 0}
            pageSize={data?.perPage || 10}
            indexCurrent={currentPage}
            setIndexCurrent={setCurrentPage}
          />{' '}
        </div>

        <div className="flex-1 overflow-scroll ml-5">
          <TableList
            columns={columns}
            dataRows={suppliers}
            sortBy={sortBy}
            sortDir={sortDir}
            setSortBy={setSortBy}
            setSortDir={setSortDir}
            headerFreeze
          />
        </div>
      </div>
    </>
  );
}
