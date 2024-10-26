'use client';

import SectionTitle from '@/app/components/SectionTitle';
import React, { useMemo, useState } from 'react';
import TextField from '../../molecules/UserFormTextField';
import { Controller, useForm } from 'react-hook-form';
import InlineSelect from '@/app/components/InlineSelect';
import PageTitle from '@/app/components/PageTitle';
import { yupResolver } from '@hookform/resolvers/yup';
import { createSupplierValidationSchema } from '@/app/utils/suppliers';
import { SUPPLIER_INPUT } from '@/app/constants/supplier.const';
import { Supplier } from '@/app/types/entities';
import useSWR from 'swr';
import * as Suppliers from '@/app/api/entities/suppliers';
import clsx from 'clsx';
import { ICONS } from '@/app/assets/icons';
import Image from 'next/image';
import masterDataApi from '@/app/api/entities/common';

export interface ISupplierInformationFormData {
  supplierCd?: string;
  supplierName?: string;
  supplierNameKana?: string;
  tel?: string;
  postCd?: string;
  address1?: string;
  address2?: string;
  address3?: string;
}

interface SupplierInformationProps {
  edit?: boolean;
  session: string;
  supplier?: Supplier;
  onSubmit?: (data: ISupplierInformationFormData) => Promise<void>;
}

const SupplierInfomationForm: React.FC<SupplierInformationProps> = ({
  edit,
  session,
  supplier,
  onSubmit = () => {},
}) => {
  const [schema] = useState(createSupplierValidationSchema(edit));

  const { control, handleSubmit, formState, watch, setValue } =
    useForm<ISupplierInformationFormData>({
      defaultValues: {
        supplierCd: supplier?.supplierCd || '',
        supplierName: supplier?.supplierName || '',
        supplierNameKana: supplier?.supplierNameKana || '',
        tel: supplier?.tel || '',
        postCd: supplier?.postCd || '',
        address1: supplier?.address1 || '',
        address2: supplier?.address2 || '',
        address3: supplier?.address3 || '',
      },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // const { data: suppliers } = useSWR(
  //   'all-suppliers',
  //   () => Suppliers.all(session),
  //   { suspense: true },
  // );

  const handlePostCodeChange = async () => {
    try {
      const res = await masterDataApi.getAddresses(String(watch('postCd')), session); 
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
        <PageTitle className="pt-6" title="サプライヤ情報更新" />
        <div className=" pb-[118px] flex justify-between">
          <div className="w-[77.9%]">
            <SectionTitle title="サプライヤ情報" className="mt-[22px]" />

            <div className="pl-5 pt-[26px]">
              <div className="table w-full">

                <Controller
                  control={control}
                  name="supplierName"
                  render={({ field, fieldState }) => (
                    <TextField
                      className="py-2  border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      label={SUPPLIER_INPUT.SUPPLIERNAME.LABEL}
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="supplierNameKana"
                  render={({ field, fieldState }) => (
                    <TextField
                      className="py-2  border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      label={SUPPLIER_INPUT.SUPPLIERNAMEKANA.LABEL}
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="tel"
                  render={({ field, fieldState }) => (
                    <TextField
                      className="py-2  border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      label={SUPPLIER_INPUT.TEL.LABEL}
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
                
                <Controller
                  control={control}
                  name="postCd"
                  render={({ field, fieldState }) => (
                       <div className="flex items-start  py-2 border-b-[1px] border-solid border-[#E1E7EB]">
                    <TextField
                    className="  lg:w-1/2 min-w-[100px]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      label={SUPPLIER_INPUT.POSTCODE.LABEL}
                      error={fieldState.error?.message}
                      {...field}
                    />
                      <button
              type="button"
              className="flex items-center lg:w- 50%  ml-2 p-2  border rounded-md border-b-5 border-transparent hover:border-green-900"
              style={{ whiteSpace: "nowrap" }}
              onClick={() => {
                // 郵便番号検索アイコンがクリックされたら検索
                handlePostCodeChange();
              }}
            >
              < Image alt="Search" src={ICONS.SEARCH} className="w-4 h-4"/>
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
                      label={SUPPLIER_INPUT.ADDRESS1.LABEL}
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
                      label={SUPPLIER_INPUT.ADDRESS2.LABEL}
                      error={fieldState.error?.message}
                      {...field}
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
                      label={SUPPLIER_INPUT.ADDRESS3.LABEL}
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div className="w-[18.28%] pt-6 mr-[21px]">
            <p className="leading-2 tracking-[0.07px] text-sm text-center whitespace-pre mb-3">{`内容の確認後、
更新ボタンを押してください`}</p>
            <button
              disabled={formState.isSubmitting}
              onClick={handleSubmit(onSubmit)}
              className={clsx(
                'pt-4 rounded-md pb-[18px] w-full bg-darkPrimary text-dark-primary-contrast font-bold leading-[22px] tracking-[1.4px] text-md',
                { 'opacity-50': formState.isSubmitting },
              )}
            >
              更新
            </button>
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
          更新
        </button>
      </div>
    </div>
  );
};

export default SupplierInfomationForm;
