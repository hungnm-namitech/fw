'use client';

import SectionTitle from '@/app/components/SectionTitle';
import React, { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import TextField from '../../molecules/UserFormTextField';
import { Controller, useForm } from 'react-hook-form';
import InlineSelect from '@/app/components/InlineSelect';
import PageTitle from '@/app/components/PageTitle';
import { yupResolver } from '@hookform/resolvers/yup';
import { createBaseValidationSchema } from '@/app/utils/bases';
import { USER_ROLE } from '@/lib/constants';
import { BASE_INPUT } from '@/app/constants/base.const';
import { Base } from '@/app/types/entities';
import useSWR from 'swr';
import * as Companies from '@/app/api/entities/companies';
import masterDataApi from '@/app/api/entities/common';
import clsx from 'clsx';
import { ICONS } from '@/app/assets/icons';
import { useAppSelector } from '@/app/store';
import { selectMe } from '@/app/selectors/auth';
import Image from 'next/image';

export interface IBaseInformationFormData {
  companyCd?: string;
  id?: string;
  baseName?: string;
  baseNameKana?: string;
  telNumber?: string;
  postCode?: string;
  address1?: string;
  address2?: string;
  address3?: string;
}

interface BaseInformationProps {
  edit?: boolean;
  session: string;
  base?: Base;
  onSubmit?: (data: IBaseInformationFormData) => Promise<void>;
}

const BaseInfomationForm: React.FC<BaseInformationProps> = ({
  edit,
  session,
  base,
  onSubmit = () => {},
}) => {
  const schema = useMemo(() => {
    return createBaseValidationSchema(edit);
  }, [edit]);
  const { data: sessionObj } = useSession();
  const { data: me } = useAppSelector(selectMe);

  const { control, handleSubmit, formState, watch, setValue } =
    useForm<IBaseInformationFormData>({
      defaultValues: {
        companyCd: sessionObj?.user?.role === USER_ROLE.PC ? me?.companyCd : base?.companyCd || '',
        baseName: base?.baseName || '',
        baseNameKana: base?.baseNameKana || '',
        telNumber: base?.telNumber || '',
        postCode: base?.postCode || '',
        address1: base?.address1 || '',
        address2: base?.address2 || '',
        address3: base?.address3 || '',
        id: String(base?.id) || '',
      },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const { data: companies } = useSWR(
    'all-companies',
    () => Companies.all(session),
    { suspense: true },
  );

  const handlePostCodeChange = async () => {
    try {
      const res = await masterDataApi.getAddresses(String(watch('postCode')), session); 
      const addressData = res?.data?.results?.at(0);
  
      //取得した住所情報をステートに設定
      setValue('address1', [addressData?.address1, addressData?.address2, addressData?.address3].filter(Boolean).join(''));
     } catch (error) {
      // エラーハンドリング
      console.error('住所情報の取得エラー:', error);
    }
  };
  

  return (
    <div>
      <div className="bg-card pl-[27px] pr-[21px]">
        {edit ? (
          <PageTitle className="pt-6" title="卸し先更新" />
        ) : (
          <PageTitle className="pt-6" title="卸し先新規登録" />
        )}
        <div className=" pb-[118px] flex justify-between">
          <div className="w-[77.9%]">
            <SectionTitle title="卸し先情報" className="mt-[22px]" />

            <div className="pl-5 pt-[26px]">
              <div className="table w-full">
                <Controller
                  control={control}
                  name="companyCd"
                  render={({ field, fieldState }) => (
                    <InlineSelect
                      label={BASE_INPUT.COMPANYNM.LABEL}
                      {...field}
                      className="py-2  border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      options={companies.map(companies => ({
                        label: companies.companyName,
                        value: companies.id.toString(),
                      }))}
                      error={fieldState.error?.message}
                      placeholder="選択してください"
                      disabled={edit || sessionObj?.user.role === USER_ROLE.PC}
                      />
                  )}
                />

                <Controller
                  control={control}
                  name="baseName"
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
                  name="baseNameKana"
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
                  name="telNumber"
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
                  name="postCode"
                  render={({ field, fieldState }) => (
                    <div className="flex items-start py-2 border-b-[1px] border-solid border-[#E1E7EB]">
                    <TextField
                      className="lg:w-1/2 min-w-[100px]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      label={BASE_INPUT.POSTCD.LABEL}
                      error={fieldState.error?.message}
                      {...field}
                    
                    />
                    <button
              type="button"
              className="flex items-center lg:w- 50%  ml-2 p-2 border rounded-md border-b-5 border-transparent hover:border-green-900"
              style={{ whiteSpace: "nowrap" }}
              onClick={() => {
                // 郵便番号検索アイコンがクリックされたら検索
                handlePostCodeChange();
              }}
            >
              < Image alt="Search" src={ICONS.SEARCH} className=""/>
              住所検索
            </button>
            </div>
                  )}
                />
                <Controller
                  control={control}
                  name="address1"
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
                  name="address2"
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
                <Controller
                  control={control}
                  name="address3"
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
              </div>
            </div>
          </div>
          <div className="w-[18.28%] pt-6 mr-[21px]">
          {edit?(<p className="leading-2 tracking-[0.07px] text-sm text-center whitespace-pre mb-3">{`内容の確認後、
更新ボタンを押してください`}</p>
          ):(
            <p className="leading-2 tracking-[0.07px] text-sm text-center whitespace-pre mb-3">{`内容の確認後、
登録ボタンを押してください`}</p>
          )}
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
          </div>
        </div>
      </div>
      <div className="mt-10 bg-card flex items-center flex-col py-[45px]">
        <p className="font-bold leading-normal text-2xl">
          {edit?
            '内容の確認後、更新ボタンを押してください'
            :
            `内容の確認後、登録ボタンを押してください`
          }
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

export default BaseInfomationForm;
