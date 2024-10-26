'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/Button';
import { ICONS } from '@/app/assets/icons';
import FormSearch, { SearchFieldProps } from '../FormSearch';
import Pagination from '../Pagination';
import BaseTableList, { IColumnProps } from '../BaseTableList';
import { useForm, useWatch } from 'react-hook-form';
import { FIELD_TYPE, SORT_STATUS, VALIDATE } from '@/lib/constants';
import useSWRImmutable, { mutate } from 'swr';
import * as Bases from '@/app/api/entities/base';
import { Base } from '@/app/types/entities';
import useSWR from 'swr';
import * as Companies from '@/app/api/entities/companies';
import DeleteModal from '../DeleteModal';

interface BaseListHandlerProps {
  session: string;
}

export default function BaseListHandler({ session }: BaseListHandlerProps) {
  const { register, control } = useForm();
  const watchAllFields = useWatch({ control });
  const [deleteBases, setDeleteBases] = useState<null | Base>(null);
  // const [bases, setBases] = useState<Base[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDir, setSortDir] = useState<SORT_STATUS>(SORT_STATUS.ASC);

  const { data: baseData, isLoading } = useSWRImmutable(
    ['base', watchAllFields, currentPage, sortBy, sortDir],
    () =>
      Bases.getList(session || '', {
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

  const bases = useMemo(
    () =>
      baseData?.items?.map(item => {
        return {
          ...item,
          action: (
            <div className="flex w-fit">
              <Button
                type="submit"
                className="!w-fit h-[26px] !min-h-[26px] pl-5 pr-5 mr-2 pt-1 pb-1 bg-white rounded justify-center items-center inline-flex border border-[#35433E] !text-[#35433E] "
                href={`bases/${item?.id}/edit`}
              >
                <p className="text-[14px] font-noto-sans-jp leading-[17.5px]">
                  編集
                </p>
              </Button>
              <Button
                type="submit"
                className="!w-fit h-[26px] !min-h-[26px] pl-5 pr-5 pt-1 pb-1 bg-[#C53F3F] rounded justify-center items-center inline-flex"
                onClick={() => {
                  setDeleteBases(item);
                }}
              >
                <p className="text-[14px] font-noto-sans-jp leading-[17.5px]">
                  削除
                </p>
              </Button>
            </div>
          ),
        };
      }) || [],
    [baseData],
  );
  const { data: companies } = useSWR(
    'all-companies',
    () => Companies.all(session),
    { suspense: true },
  );

  const handleDeleteBases = () => {
    if (deleteBases?.baseName) {
      Bases.deleteBases(+deleteBases?.id, session)
        .then(item => {
          setDeleteBases(null);
          mutate(['base', watchAllFields, currentPage, sortBy, sortDir]);
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
        maxLength: VALIDATE.NAME_MAX_LENGTH,
      }),
      name: 'companyId',
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
      label: '卸し先ID',
      classfield: 'w-60 mx-2 mt-1.5',
      placeholder: '',
      ...register('id', {
        maxLength: VALIDATE.NAME_MAX_LENGTH,
      }),
      name: 'id',
      className: '!h-[40px]',
    },
    {
      label: '卸し先名',
      classfield: 'w-[280px] mx-2 mt-1.5',
      placeholder: '',
      ...register('baseName', {
        maxLength: VALIDATE.NAME_MAX_LENGTH,
      }),
      name: 'baseName',
      className: '!h-[40px]',
    },
  ];

  const columns: IColumnProps[] = [
    { title: '卸し先ID', key: 'id', isSort: true, className: 'w-[100px]' },
    {
      title: '卸し先名',
      key: 'baseName',
      isSort: true,
      className: 'w-[250px]',
    },
    {
      title: '卸し先名（フリガナ）',
      key: 'baseNameKana',
      isSort: true,
      className: 'w-[250px]',
    },
    {
      title: 'PC工場',
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
          <div className="text-gray-900 font-bold leading-[30px] text-[24px]">
            卸し先一覧
          </div>
          <Button
            type="submit"
            color={'primary'}
            className="!px-[16px] !py-[5px] !w-fit !min-h-[30px]"
            href="/bases/create"
          >
            <div className="text-[14px] w-fit leading-5 flex h-[20px]">
              <Image alt="User" src={ICONS.ADD} className="" />
              新規卸し先登録
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
            {`全${baseData?.total || 0}件中${
              baseData?.items.length || 10
            }件を表示`}
          </div>
          <Pagination
            total={baseData?.total || 0}
            pageSize={baseData?.perPage || 10}
            indexCurrent={currentPage}
            setIndexCurrent={setCurrentPage}
          />{' '}
        </div>

        <div className="flex-1 overflow-scroll ml-5">
          <BaseTableList
            columns={columns}
            dataRows={bases}
            sortBy={sortBy}
            sortDir={sortDir}
            setSortBy={setSortBy}
            setSortDir={setSortDir}
            headerFreeze
          />
        </div>
      </div>
      <DeleteModal
        onClose={() => setDeleteBases(null)}
        open={Boolean(deleteBases)}
        handleDelete={handleDeleteBases}
        title={`${deleteBases?.baseName}　を削除しますか？`}
      />
    </>
  );
}
