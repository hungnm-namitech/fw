'use client';

import SectionTitle from '@/app/components/SectionTitle';
import React, { useMemo } from 'react';
import TextField from '../../molecules/UserFormTextField';
import { Controller, useForm } from 'react-hook-form';
import InlineSelect from '@/app/components/InlineSelect';
import PageTitle from '@/app/components/PageTitle';
import { yupResolver } from '@hookform/resolvers/yup';
import { createUserValidationSchema } from '@/app/utils/users';
import { BASE_INPUT } from '@/app/constants/base.const';

interface IBaseEditProps {
  authorities: { id: string; name: string }[];
  companies: { id: string; name: string }[];
  edit?: boolean;
}

const BaseEditForm: React.FC<IBaseEditProps> = ({
  authorities,
  companies,
  edit,
}) => {
  const submit = (e: any) => {
    console.debug('form submitted!');
  };

  const schema = useMemo(() => {
    return createUserValidationSchema(edit);
  }, [edit]);

  const { control, handleSubmit } = useForm<{
    logInId?: string;
    username?: string;
    usernamePronunciation?: string;
    company?: string;
    authority?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
    passwordConfirmation?: string;
  }>({
    defaultValues: {
      logInId: '12312312',
      authority: '0',
      company: '1',
      email: 'tttttttt@gmail.com',
      password: '',
      passwordConfirmation: '',
      phoneNumber: '09012345678',
      username: '新村 ひろみ',
      usernamePronunciation: 'アラムラ ヒロミ',
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  return (
    <div>
      <div className="bg-card pl-[27px] pr-[21px]">
        <PageTitle className="pt-6" title="卸し先情報更新" />
        <div className=" pb-[118px] flex justify-between">
          <div className="w-[77.9%]">
            <SectionTitle title="卸し先情報" className="mt-[22px]" />

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
                      label={BASE_INPUT.BASEID.LABEL}
                      error={fieldState.error?.message}
                      viewOnly={edit}
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="logInId"
                  render={({ field, fieldState }) => (
                    <TextField
                      className="pb-2 border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      label={BASE_INPUT.COMPANYNM.LABEL}
                      error={fieldState.error?.message}
                      viewOnly={edit}
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="username"
                  render={({ field, fieldState }) => (
                    <TextField
                      className="py-2  border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      label={BASE_INPUT.BASENM.LABEL}
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
                      className="py-2  border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      label={BASE_INPUT.BASENMKN.LABEL}
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="authority"
                  render={({ field, fieldState }) => (
                    <TextField
                      className="py-2  border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      label={BASE_INPUT.TELNUMBER.LABEL}
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="company"
                  render={({ field, fieldState }) => (
                    <TextField
                      label={BASE_INPUT.POSTCD.LABEL}
                      {...field}
                      className="py-2  border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      error={fieldState.error?.message}
                      placeholder="選択してください"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field, fieldState }) => (
                    <TextField
                      className="py-2  border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      label={BASE_INPUT.ADDRESS1.LABEL}
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
                      className="py-2  border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      label={BASE_INPUT.ADDRESS2.LABEL}
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
                          className="py-2  border-b-[1px] border-solid border-[#E1E7EB]"
                          labelClass="min-w-[210px] mt-2"
                          inputWrapperClass="ml-[56px]"
                          label={BASE_INPUT.ADDRESS3.LABEL}
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
              onClick={handleSubmit(submit)}
              className="pt-4 rounded-md pb-[18px] w-full bg-darkPrimary text-dark-primary-contrast font-bold leading-[22px] tracking-[1.4px] text-md"
            >
              {edit ? '更新' : '登録'}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-10 bg-card flex items-center flex-col py-[45px]">
        <p className="font-bold leading-normal text-2xl">
          内容の確認後、更新ボタンを押してください
        </p>
        <button
          onClick={handleSubmit(submit)}
          className="pt-4 mt-6 rounded-md pb-[18px] w-[280px] bg-darkPrimary text-dark-primary-contrast font-bold leading-[22px] tracking-[1.4px] text-md"
        >
          {edit ? '更新' : '登録'}
        </button>
      </div>
    </div>
  );
};

export default BaseEditForm;
