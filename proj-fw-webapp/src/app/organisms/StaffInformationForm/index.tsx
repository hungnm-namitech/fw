'use client';

import SectionTitle from '@/app/components/SectionTitle';
import React, { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import TextField from '../../molecules/StaffFormTextField';
import { Controller, useForm } from 'react-hook-form';
import InlineSelect from '@/app/components/InlineSelect';
import PageTitle from '@/app/components/PageTitle';
import { yupResolver } from '@hookform/resolvers/yup';
import { createStaffValidationSchema } from '@/app/utils/staffs';
import { USER_ROLE } from '@/lib/constants';
import { STAFF_INPUT } from '@/app/constants/staff.const';
import * as Companies from '@/app/api/entities/companies';import * as Staffs from '@/app/api/entities/staffs';
import useSWR from 'swr';
import clsx from 'clsx';
import { Staff } from '@/app/types/entities';
import { useAppSelector } from '@/app/store';
import { selectMe } from '@/app/selectors/auth';



export interface IStaffInformationFormData {
  id?: string;
  staffName?: string;
  staffNameKana?: string;
  companyCd?: string;
  companyName?:string;
  authority?: string;
}
interface StaffInformationProps {
  edit?: boolean;
  session: string;
  staff?: Staff;
  onSubmit?: (data: IStaffInformationFormData) => Promise<void>;
  userRole?: number;
  error?: string;
}

const StaffInformationForm: React.FC<StaffInformationProps> = ({
  edit,
  session,
  staff,
  onSubmit = () => {},
  error,
}) => {
  const schema = useMemo(() => {
    return createStaffValidationSchema(edit);
  }, [edit]);
  const { data: sessionObj } = useSession();
  const { data: me } = useAppSelector(selectMe);

  const { control, handleSubmit, formState} =
    useForm<IStaffInformationFormData>({
      defaultValues: {
        id: String(staff?.id) || '',
        companyCd: sessionObj?.user?.role === USER_ROLE.PC ? me?.companyCd : staff?.companyCd || '',
        staffName: staff?.staffName || '',
        staffNameKana: staff?.staffNameKana || '',
      },
      resolver: yupResolver(schema),
      mode: 'onChange',
    });

   
    
   
  const { data: companies } = useSWR(
    'all-companies',
    () => Companies.all(session),
    { suspense: true },
  );

 

  return (
    <div className="w-full">
      <div className="bg-card pl-[27px] pr-[21px]">
      {edit ? (
          <PageTitle className="pt-6" title="担当者更新" />
        ) : (
          <PageTitle className="pt-6" title="担当者新規登録" />
        )}
        <div className=" pb-[118px] flex justify-between">
          <div className="w-[77.9%]">
            <SectionTitle title="担当者情報" className="mt-[22px] min-h-[56px] border-b-[1px] border-b-[#E1E7EB] flex items-center" />

            {error && <p className="pl-5 mt-3 text-[red]">{error}</p>}

            <div className="pl-5 pt-[26px]">
              <div className="table w-full">
              {edit && (
                  <>
                  <Controller
                    control={control}
                    name="id"
                    render={({ field, fieldState, formState }) => (
                      <TextField
                        className="pb-2 border-b-[1px] border-solid border-[#E1E7EB]"
                        labelClass="min-w-[210px] mt-2"
                        inputWrapperClass="ml-[56px]"
                        label={STAFF_INPUT.STAFF_ID.LABEL}
                        error={fieldState.error?.message}
                        viewOnly={edit}
                        {...field}
                      />
                     )}
                  />
                    
                  </>
                   )}

                  
                  <Controller
                    control={control}
                    name="companyCd"
                    render={({ field, fieldState }) => (
                      <InlineSelect
                        label={STAFF_INPUT.COMPANY.LABEL}
                        {...field}
                        className="py-2 border-b-[1px] border-solid border-[#E1E7EB]"
                        labelClass="min-w-[210px] mt-2"
                        inputWrapperClass="ml-[56px]"
                        error={fieldState.error?.message}
                        options={companies.map(company => ({
                           label: company.companyName,
                           value: company.id.toString()
                         }))}
                         placeholder="選択してください"
                         disabled={edit || sessionObj?.user.role === USER_ROLE.PC}
                         />
                      )}
                  />
                
                  
                
                <Controller
                  control={control}
                  name="staffName"
                  render={({ field, fieldState }) => (
                    <TextField
                      className="py-2  border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      label={ STAFF_INPUT.STAFFNAME.LABEL}
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="staffNameKana"
                  render={({ field, fieldState }) => (
                    <TextField
                      className="py-2  border-b-[1px] border-solid border-[#E1E7EB]"
                      labelClass="min-w-[210px] mt-2"
                      inputWrapperClass="ml-[56px]"
                      label={STAFF_INPUT.STAFFNAME_PRONUNCIATION.LABEL}
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
      {edit ? (
  <p className="font-bold leading-normal text-2xl">
          内容の確認後、更新ボタンを押してください
 	 </p>
) : (
  <p className="font-bold leading-normal text-2xl">
          内容の確認後、登録ボタンを押してください
        </p>
 
)}
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

export default StaffInformationForm;
