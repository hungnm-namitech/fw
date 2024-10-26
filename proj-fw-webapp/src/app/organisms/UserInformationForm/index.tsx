'use client';

import SectionTitle from '@/app/components/SectionTitle';
import React, { useCallback, useMemo, useState } from 'react';
import TextField from '../../molecules/UserFormTextField';
import { Controller, useForm } from 'react-hook-form';
import InlineSelect from '@/app/components/InlineSelect';
import PageTitle from '@/app/components/PageTitle';
import { yupResolver } from '@hookform/resolvers/yup';
import { createUserValidationSchema } from '@/app/utils/users';
import { USER_INPUT } from '@/app/constants/users.const';
import * as Companies from '@/app/api/entities/companies';
import * as Suppliers from '@/app/api/entities/suppliers';
import * as Roles from '@/app/api/entities/roles';
import useSWR from 'swr';
import clsx from 'clsx';
import { User } from '@/app/types/entities';
import { USER_ROLE } from '@/lib/constants';
import * as Users from '@/app/api/entities/users';

export interface IUserInformationFormData {
  logInId?: string;
  username?: string;
  usernamePronunciation?: string;
  company?: string;
  authority?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
  userRole?: number;
}
interface UserInformationProps {
  edit?: boolean;
  session: string;
  user?: User;
  onSubmit?: (data: IUserInformationFormData) => Promise<void>;
  userRole?: number;
  error?: string;
  title: string;
}

const getCompanyId = (
  roleDiv?: number,
  companyId?: string | null,
  supplierId?: string | null,
) => {
  if (roleDiv && +roleDiv === USER_ROLE.PC) {
    return companyId || '';
  }
  if (roleDiv && +roleDiv === USER_ROLE.SUPPLIER) {
    return supplierId || '';
  }

  return '';
};

const UserInformationForm: React.FC<UserInformationProps> = ({
  edit,
  session,
  user,
  userRole,
  onSubmit = () => {},
  error,
  title,
}) => {
  const [resettingPassword, setResettingPassword] = useState(false);

  const [schema] = useState(createUserValidationSchema(edit));

  const {
    control,
    handleSubmit,
    formState,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<IUserInformationFormData>({
    defaultValues: {
      logInId: user?.userId || '',
      authority: (user?.roleDiv || '').toString(),
      company: getCompanyId(
        user?.roleDiv,
        user?.companyId,
        user?.supplierId,
      ).toString(),
      email: user?.mailAddress || '',
      password: '',
      passwordConfirmation: '',
      phoneNumber: user?.tel || '',
      username: user?.username || '',
      usernamePronunciation: user?.usernameKana || '',
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleChangeRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('authority', e.currentTarget.value);
    setValue('company', '');
    clearErrors('authority');
  };

  const handleResetPassword = async () => {
    try {
      if (user?.mailAddress && !resettingPassword) {
        setResettingPassword(true);
        await Users.resetPassword(user.mailAddress, session);
        alert(`${user.username} 様のパスワードを初期化いたしました。`);
      }
    } catch (e) {
      alert('Error occurred!');
      console.error(e);
    } finally {
      setResettingPassword(false);
    }
  };

  const {
    data: { companies, roles, suppliers },
  } = useSWR(
    'fetch-resource',
    async () => ({
      companies: await Companies.all(session),
      roles: await Roles.all(session),
      suppliers: await Suppliers.allParent(session),
    }),
    { suspense: true },
  );

  const role = watch('authority') || '';

  const companyOptions = (() => {
    if (+role === USER_ROLE.PC) {
      return companies?.map(company => ({
        label: company.companyName,
        value: company.id.toString(),
      }));
    }

    if (+role === USER_ROLE.SUPPLIER) {
      return suppliers?.map(supplier => ({
        label: supplier.supplierName,
        value: supplier.supplierCd.toString(),
      }));
    }

    return [];
  })();

  return (
    <div className="w-full">
      <div className="bg-card pl-[27px] pr-[21px]">
        <PageTitle className="pt-6" title={title} />
        <div className=" pb-[35px] flex justify-between">
          <div className="w-[77.9%]">
            <SectionTitle
              title="ユーザー情報"
              className="mt-[22px] min-h-[56px] border-b-[1px] border-b-[#E1E7EB] flex items-center"
            />

            {error && <p className="pl-5 mt-3 text-[red]">{error}</p>}

            <div className="pl-5 pt-[26px]">
              <div className="table w-full">
                <Controller
                  control={control}
                  name="logInId"
                  render={({ field, fieldState }) => (
                    <TextField
                      className="pb-2 border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      label={USER_INPUT.LOG_IN_ID.LABEL}
                      error={fieldState.error?.message}
                      viewOnly={edit}
                      {...field}
                      descriptions={['5文字以上50文字以内で設定してください。']}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="username"
                  render={({ field, fieldState }) => (
                    <TextField
                      className="py-3  border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      label={USER_INPUT.USERNAME.LABEL}
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="usernamePronunciation"
                  render={({ field, fieldState }) => (
                    <TextField
                      className="py-3  border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      label={USER_INPUT.USERNAME_PRONUNCIATION.LABEL}
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="authority"
                  render={({ field, fieldState }) => (
                    <InlineSelect
                      label={USER_INPUT.AUTHORITY.LABEL}
                      {...field}
                      onChange={handleChangeRole}
                      className="py-3  border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      options={roles?.map(role => ({
                        label: role.label,
                        value: role.value.toString(),
                      }))}
                      error={fieldState.error?.message}
                      placeholder="選択してください"
                    />
                  )}
                />
                <Controller
                  control={control}
                  disabled={+role == USER_ROLE.ADMIN || +role == USER_ROLE.FW}
                  name="company"
                  render={({ field, fieldState }) => (
                    <InlineSelect
                      label={USER_INPUT.COMPANY.LABEL}
                      {...field}
                      className="py-3  border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      error={fieldState.error?.message}
                      options={companyOptions}
                      placeholder="選択してください"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field, fieldState }) => (
                    <TextField
                      className="py-3  border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      label={USER_INPUT.PHONE_NUMBER.LABEL}
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <TextField
                      className="py-3  border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      label={USER_INPUT.EMAIL.LABEL}
                      {...field}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                {!edit && (
                  <>
                    <Controller
                      control={control}
                      name="password"
                      render={({ field, fieldState }) => (
                        <TextField
                          className="py-3  border-b-[1px] border-solid border-[#E1E7EB]"
                          labelClass="min-w-[210px] mt-2"
                          inputWrapperClass="ml-[56px]"
                          label={USER_INPUT.PASSWORD.LABEL}
                          error={fieldState.error?.message}
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="passwordConfirmation"
                      render={({ field, fieldState }) => (
                        <TextField
                          className="py-3  "
                          labelClass="min-w-[210px] mt-2"
                          inputWrapperClass="ml-[56px]"
                          label={USER_INPUT.PASSWORD_CONFIRMATION.LABEL}
                          descriptions={[
                            '5文字以上50文字以内で設定してください。',
                            '利用できる文字は半角英文字、半角数字、半角記号です。',
                            'アルファベットの大文字、小文字、数字を必ず1文字以上使用することを推奨します。',
                          ]}
                          error={fieldState.error?.message}
                          {...field}
                        />
                      )}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="w-[18.28%] pt-6 mr-[21px]">
            <p className="leading-2 tracking-[0.07px] text-sm text-center whitespace-pre mb-3">{`内容の確認後、
  登録ボタンを押してください`}</p>
            <button
              disabled={formState.isSubmitting}
              onClick={handleSubmit(onSubmit)}
              className={clsx(
                'pt-4 rounded-md pb-[18px] w-full bg-darkPrimary text-dark-primary-contrast font-bold leading-[22px] tracking-[1.4px] text-md',
                { 'opacity-50': formState.isSubmitting },
              )}
            >
              {edit ? '更新' : '登録'}
            </button>

            {edit && userRole === USER_ROLE.ADMIN && (
              <button
                disabled={formState.isSubmitting}
                onClick={handleResetPassword}
                className={clsx(
                  'rounded-md mt-[30px] py-[17px] w-full  text-primary bg-white font-bold leading-[22px] tracking-[1.4px] text-md border-[1px] border-primary border-solid',
                  { 'opacity-50': formState.isSubmitting },
                )}
              >
                パスワード初期化
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-10 bg-card flex items-center flex-col py-[45px]">
        <p className="font-bold leading-normal text-2xl">
          内容の確認後、更新ボタンを押してください
        </p>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={formState.isSubmitting}
          className={clsx(
            'pt-4 mt-6 rounded-md pb-[18px] w-[280px] bg-darkPrimary text-dark-primary-contrast font-bold leading-[22px] tracking-[1.4px] text-md',
            { 'opacity-50': formState.isSubmitting },
          )}
        >
          {edit ? '更新' : '登録'}
        </button>
      </div>
    </div>
  );
};

export default UserInformationForm;
