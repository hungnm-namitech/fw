'use client';

import React, { useCallback } from 'react';
import useSWR from 'swr';
import * as Staffs from '@/app/api/entities/staffs';
import { useParams, useRouter } from 'next/navigation';
import StaffInformationForm, {
  IStaffInformationFormData,
} from '@/app/organisms/StaffInformationForm';
import Loader from '@/app/components/Loader';
import { Staff } from '@/app/types/entities';
import { PAGES } from '@/app/constants/common.const';
import { errorHandler } from '@/app/utils/common';


interface StaffEditHandlerProps {
  session: string;
}



export default function StaffEditHandler({ session }: StaffEditHandlerProps) {
  const params = useParams() as { staffId: string };

  const router = useRouter();

  const handleSubmit = useCallback(
    async (data: IStaffInformationFormData) => {
      if (session) {
        try {
          const staff: Pick<
            Staff,
            | 'staffName'
            | 'staffNameKana'
            | 'companyCd'
          > = {
            companyCd: data.companyCd || '',
            staffName: data.staffName || '',
            staffNameKana: data.staffNameKana || '',
          };
          await Staffs.edit(staff, params.staffId, session);
          router.push(PAGES.STAFFS);
        } catch (e) {
          console.error(e);
          errorHandler(e, router);
        }
      }
    },
    [session],
  );

  const { data: staff, isLoading } = useSWR(
    ['find-a-user', params.staffId],
    () => Staffs.find(params.staffId, session),
    {
      onError: err => {
        if (err.response.status === 404) {
          router.push('/404');
          return;
        }
        throw err;
      },
    },
  );
  

  if (isLoading) return <Loader />;

  return (
    <StaffInformationForm
      onSubmit={handleSubmit}
      staff={staff}
      session={session}
      edit
    />
  );
}
