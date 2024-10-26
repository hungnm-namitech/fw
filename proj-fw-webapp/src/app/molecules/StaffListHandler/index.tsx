'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/Button';
import { ICONS } from '@/app/assets/icons';
import FormSearch, { SearchFieldProps } from '../FormSearch';
import Pagination from '../Pagination';
import StaffTableList, { IColumnProps } from '../StaffTableList';
import { useForm, useWatch } from 'react-hook-form';
import { FIELD_TYPE, SORT_STATUS, VALIDATE } from '@/lib/constants';
import useSWRImmutable, { mutate } from 'swr';
import * as Staffs from '@/app/api/entities/staffs';
import { Staff } from '@/app/types/entities';
import { formatJapaneseDate } from '@/lib/utilities';
import * as Companies from '@/app/api/entities/companies';
import useSWR from 'swr';
import DeleteModal from '../DeleteModal';
import 'react-tooltip/dist/react-tooltip.css';

interface StaffListHandlerProps {
  session: string;
}

export default function StaffListHandler({ session }: StaffListHandlerProps) {
  const {
    register,
    formState: { errors },
    control,
  } = useForm();

  const watchAllFields = useWatch({ control });
  const [deleteStaff, setDeleteStaff] = useState<null | Staff>(null);
  // const [staff, setStaff] = useState<Staff[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDir, setSortDir] = useState<SORT_STATUS>(SORT_STATUS.ASC);

  const { data: staffData, isLoading } = useSWRImmutable(
    ['staff', watchAllFields, currentPage, sortBy, sortDir],
    () =>
      Staffs.getList(session || '', {
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

  const staffs = useMemo(
    () =>
      staffData?.items?.map(item => {
        return {
          ...item,
          updatedTime: formatJapaneseDate(item.updatedAt || ''),
          action: (
            <div className="flex w-fit">
              <Button
                type="submit"
                className="!w-fit h-[26px] !min-h-[26px] pl-5 pr-5 mr-2 pt-1 pb-1 bg-white rounded justify-center items-center inline-flex border border-[#35433E] !text-[#35433E] "
                href={`staffs/${item.id}/edit`}
              >
                編集
              </Button>
              <Button
                type="submit"
                className="!w-fit h-[26px] !min-h-[26px] pl-5 pr-5 pt-1 pb-1 bg-[#C53F3F] rounded justify-center items-center inline-flex"
                onClick={() => {
                  setDeleteStaff(item);
                }}
              >
                削除
              </Button>
            </div>
          ),
        };
      }) || [],
    [staffData],
  );

  const { data: companies } = useSWR(
    'all-companies',
    () => Companies.all(session),
    { suspense: true },
  );

  const handleDeleteStaff = () => {
    if (deleteStaff?.staffName) {
      Staffs.deleteStaff(+deleteStaff?.staffName, session)
        .then(item => {
          setDeleteStaff(null);
          mutate([watchAllFields, currentPage, sortBy, sortDir]);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const searchFields: SearchFieldProps[] = [
    {
      label: 'PC工場',
      inputType: FIELD_TYPE.INLINE_SELECT,
      classfield: 'w-60 mx-2 mt-1.5',
      placeholder: '',
      ...register('companyId', {
        minLength: VALIDATE.LOGINID_MIN_LENGTH,
      }),
      name: 'companyId',
      error: errors?.companyId?.message?.toString(),
      options: [
        {
          label: '全て',
          value: '',
        },
      ].concat(
        companies.map(companies => ({
          label: companies.companyName,
          value: companies.id.toString(),
        })),
      ),
      className: '!h-[40px]',
    },
    {
      label: '担当者ID',
      classfield: 'w-60 mx-2 mt-1.5',
      placeholder: '',
      ...register('id', {
        minLength: VALIDATE.LOGINID_MIN_LENGTH,
        maxLength: VALIDATE.LOGINID_MAX_LENGTH,
      }),
      name: 'id',
      error: errors?.IoginID?.message?.toString(),
    },
    {
      label: '担当者名',
      classfield: 'w-60 mx-2 mt-1.5',
      placeholder: '',
      ...register('staffName', {
        maxLength: VALIDATE.NAME_MAX_LENGTH,
      }),
      name: 'staffName',
      error: errors?.name?.message?.toString(),
    },
  ];
  const columns: IColumnProps[] = [
    { title: '担当者ID', key: 'id', isSort: true, className: 'w-[100px]' },
    {
      title: '担当者名',
      key: 'staffName',
      isSort: true,
      className: 'w-[250px]',
    },
    {
      title: '担当者名（フリガナ）',
      key: 'staffNameKana',
      isSort: true,
      className: 'w-[250px]',
    },
    {
      title: 'PC工場名',
      key: 'companyName',
      isSort: true,
      className: 'w-[250px]',
    },
    { title: '', key: 'action' },
  ];

  return (
    <>
      <div className="h-[calc(100vh-116px)] w-full bg-white flex flex-col">
        <div className="h-[30px] w-full mt-[26px] pr-[17px] mb-[17px] pl-6 flex justify-between	">
          <div className="text-gray-900 text-2xl font-bold leading-7">
            担当者一覧
          </div>
          <Button
            type="submit"
            color={'primary'}
            className="!px-[16px] !py-[5px] !w-fit !min-h-[30px]"
            href="/staffs/create"
          >
            <div className="text-[14px] w-fit leading-5 flex h-[20px]">
              <Image alt="User" src={ICONS.ADD} className="" />
              新規担当者登録
            </div>
          </Button>
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
            {`全${staffData?.total || 0}件中${
              staffData?.items.length || 10
            }件を表示`}
          </div>
          <Pagination
            total={staffData?.total || 0}
            pageSize={staffData?.perPage || 10}
            indexCurrent={currentPage}
            setIndexCurrent={setCurrentPage}
          />{' '}
        </div>

        <div className="flex-1 overflow-scroll ml-5">
          <StaffTableList
            columns={columns}
            dataRows={staffs}
            sortBy={sortBy}
            sortDir={sortDir}
            setSortBy={setSortBy}
            setSortDir={setSortDir}
            headerFreeze
          />
        </div>
      </div>
      <DeleteModal
        onClose={() => setDeleteStaff(null)}
        open={Boolean(deleteStaff)}
        handleDelete={handleDeleteStaff}
        title={`${deleteStaff?.staffName}　を削除しますか？`}
      />
    </>
  );
}
