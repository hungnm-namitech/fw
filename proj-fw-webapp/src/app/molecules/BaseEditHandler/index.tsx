'use client';

import React, { useCallback } from 'react';
import useSWR from 'swr';
import * as Bases from '@/app/api/entities/base';
import { useParams, useRouter } from 'next/navigation';
import BaseInformationForm, {
  IBaseInformationFormData,
} from '@/app/organisms/BaseInformationForm';
import Loader from '@/app/components/Loader';
import { Base } from '@/app/types/entities';
import { PAGES } from '@/app/constants/common.const';
import { errorHandler } from '@/app/utils/common';


interface BaseEditHandlerProps {
  session: string;
}

export default function BaseEditHandler({ session }: BaseEditHandlerProps) {
  const params = useParams() as { baseId: string };

  const router = useRouter();

  const handleSubmit = useCallback(
    async (data: IBaseInformationFormData) => {
      if (session) {
        try {
          const base: Pick<
            Base,
            | 'companyCd'
            | 'baseName'
            | 'baseNameKana'
            | 'telNumber'
            | 'postCode'
            | 'address1'
            | 'address2'
            | 'address3'
          >= {
            companyCd: data.companyCd || '',
            baseName: data.baseName || '',
            baseNameKana: data.baseNameKana || '',
            telNumber: data.telNumber || '',
            postCode: data.postCode || '',
            address1: data.address1 || '',
            address2: data.address2 || '',
            address3: data.address3 || '',
          };
          await Bases.edit(base,params.baseId,session)
          router.push(PAGES.BASES);
        } catch (e) {
          console.error(e);
          errorHandler(e, router);
        }
      }
    },
    [session],
  );

  const { data: base, isLoading } = useSWR(
    ['find-a-base', params.baseId],
    () => Bases.find(params.baseId, session),
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
    <BaseInformationForm
      onSubmit={handleSubmit}
      base={base}
      session={session}
      edit
    />
  );
}
