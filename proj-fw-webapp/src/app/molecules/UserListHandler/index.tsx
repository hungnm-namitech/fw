'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/Button';
import { ICONS } from '@/app/assets/icons';
import FormSearch, { SearchFieldProps } from '../FormSearch';
import Pagination from '../Pagination';
import TableList, { IColumnProps } from '../TableList';
import { useForm, useWatch } from 'react-hook-form';
import {
  FIELD_TYPE,
  ROLES_DIV,
  SORT_STATUS,
  USER_ROLE,
  VALIDATE,
} from '@/lib/constants';
import useSWRImmutable from 'swr';
import * as Users from '@/app/api/entities/users';
import { User } from '@/app/types/entities';
import { formatJapaneseDate } from '@/lib/utilities';
import * as Roles from '@/app/api/entities/roles';
import useSWR from 'swr';
import DeleteModal from '../DeleteModal';
import Loader from '@/app/components/Loader';
import clsx from 'clsx';

interface UserListHandlerProps {
  session: string;
  role?: number;
}

export default function UserListHandler({
  session,
  role,
}: UserListHandlerProps) {
  const {
    register,
    formState: { errors },
    control,
  } = useForm();

  const watchAllFields = useWatch({ control });
  const [deleteUser, setDeleteUser] = useState<null | User>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDir, setSortDir] = useState<SORT_STATUS>(SORT_STATUS.DESC);
  const { data: roles, isLoading: isRolesLoading } = useSWR('all-roles', () =>
    Roles.all(session),
  );

  const handleDeleteUser = () => {
    if (deleteUser?.mUserId) {
      Users.deleteUser(+deleteUser?.mUserId, session)
        .then(item => {
          setDeleteUser(null);
          getUserList();
          alert('ユーザーの削除が成功しました');
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const searchFields: SearchFieldProps[] = [
    {
      label: 'ログインID',
      classfield: 'w-60 mx-2 mt-1.5',
      placeholder: '',
      ...register('userId', {
        minLength: VALIDATE.LOGINID_MIN_LENGTH,
        maxLength: VALIDATE.LOGINID_MAX_LENGTH,
      }),
      name: 'userId',
      error: errors?.userId?.message?.toString(),
      className: '!h-[40px]',
    },
    {
      label: 'ユーザー名称',
      classfield: 'w-60 mx-2 mt-1.5',
      placeholder: '',
      ...register('username', {
        maxLength: VALIDATE.NAME_MAX_LENGTH,
      }),
      name: 'username',
      error: errors?.username?.message?.toString(),
      className: '!h-[40px]',
    },
    {
      label: 'メールアドレス',
      classfield: 'w-[280px] mx-2 mt-1.5',
      placeholder: '',
      ...register('mailAddress', {
        maxLength: VALIDATE.EMAIL_MAX_LENGTH,
      }),
      name: 'mailAddress',
      error: errors?.mailAddress?.message?.toString(),
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
      error: errors?.tel?.message?.toString(),
      className: '!h-[40px]',
    },
    {
      label: '会社名',
      classfield: 'w-60 mx-2 mt-1.5',
      placeholder: '',
      ...register('companyName', {
        maxLength: VALIDATE.NAME_MAX_LENGTH,
      }),
      name: 'companyName',
      error: errors?.companyName?.message?.toString(),
      className: '!h-[40px]',
    },
    {
      label: '権限',
      inputType: FIELD_TYPE.INLINE_SELECT,
      classfield: 'w-60 mx-2 mt-1.5',
      placeholder: '',
      ...register('roleDiv', {
        maxLength: VALIDATE.NAME_MAX_LENGTH,
      }),
      name: 'roleDiv',
      error: errors?.roleDiv?.message?.toString(),
      options: [
        {
          label: '全て',
          value: '',
        },
      ].concat(
        (roles || []).map(role => ({
          label: role.label,
          value: role.value.toString(),
        })),
      ),
      className: '!h-[40px]',
    },
  ];

  const columns: IColumnProps[] = [
    { title: 'ログインID', key: 'userId', isSort: true },
    { title: 'ユーザー名称', key: 'username', isSort: true },
    { title: '権限', key: 'roleDivText', sortKey: 'roleDiv', isSort: true },
    { title: 'メールアドレス', key: 'mailAddress', isSort: true },
    { title: '電話番号', key: 'tel', isSort: true },
    { title: '会社名', key: 'companyName', isSort: true },
    {
      title: '入力日付',
      key: 'updatedTime',
      sortKey: 'updatedAt',
      isSort: true,
    },
    { title: '更新日付', key: 'action' },
  ];

  const {
    data: data,
    isLoading,
    mutate: getUserList,
  } = useSWRImmutable(
    ['user-list', watchAllFields, currentPage, sortBy, sortDir],
    () =>
      Users.getList(session || '', {
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
  const getCompanyName = useCallback((user: User) => {
    switch (user.roleDiv) {
      case USER_ROLE.SUPPLIER:
        return user.supplierName;
      case USER_ROLE.PC:
        return user.companyName;

      default:
        return '';
    }
  }, []);

  const users = useMemo(
    () =>
      data?.items?.map(item => {
        return {
          ...item,
          companyName: getCompanyName(item),
          updatedTime: formatJapaneseDate(item.updatedAt || ''),
          action: (
            <div className="flex w-fit">
              <Button
                type="submit"
                className="!w-fit h-[26px] !min-h-[26px] pl-5 pr-5 mr-2 pt-1 pb-1 bg-white rounded justify-center items-center inline-flex border !border-[#35433E] !text-[#35433E] "
                href={`/users/${item?.mUserId}/edit`}
              >
                <p className="text-[14px] font-noto-sans-jp leading-[17.5px]">
                  編集
                </p>
              </Button>
              <Button
                type="submit"
                disabled={role == USER_ROLE.FW}
                className={clsx(
                  '!w-fit h-[26px] !min-h-[26px] pl-5 pr-5 pt-1 pb-1 bg-[#C53F3F] rounded justify-center items-center inline-flex',
                  {
                    'bg-[#d3d3d3] border-[#d3d3d3] cursor-not-allowed':
                      role == USER_ROLE.FW,
                  },
                )}
                onClick={() => {
                  setDeleteUser(item);
                }}
              >
                <p className="text-[14px] font-noto-sans-jp leading-[17.5px]">
                  削除
                </p>
              </Button>
            </div>
          ),
          roleDivText:
            ROLES_DIV.find((role: { value: USER_ROLE; label: string }) => {
              return item.roleDiv === role.value;
            })?.label || '',
        };
      }) || [],
    [data, getCompanyName],
  );

  if (isRolesLoading) return <Loader />;

  return (
    <>
      <div className="h-[calc(100vh-116px)] w-full bg-white flex flex-col">
        <div className="h-[30px] w-full mt-[26px] pr-[17px] mb-[17px] pl-6 flex justify-between	">
          <div className="text-gray-900 font-bold leading-[30px] text-[24px]">
            ユーザー一覧
          </div>
          <Button
            type="submit"
            color={'primary'}
            className="!px-[16px] !py-[5px] !w-fit !min-h-[30px]"
            href="/users/create"
          >
            <div className="text-[14px] w-fit leading-5 flex h-[20px]">
              <Image alt="User" src={ICONS.ADD} className="" />
              新規アカウント登録
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

        <div className="flex-1 overflow-scroll ml-5 pr-8">
          <TableList
            columns={columns}
            dataRows={users}
            sortBy={sortBy}
            sortDir={sortDir}
            setSortBy={setSortBy}
            setSortDir={setSortDir}
            headerFreeze
          />
        </div>
      </div>
      <DeleteModal
        onClose={() => setDeleteUser(null)}
        open={Boolean(deleteUser)}
        handleDelete={handleDeleteUser}
        title={`${deleteUser?.userId}　を削除しますか？`}
      />
    </>
  );
}
