'use client';

import React, { useCallback } from 'react';
import useSWR from 'swr';
import * as Companies from '@/app/api/entities/companies';
import { useParams, useRouter } from 'next/navigation';
import CompanyInformationForm, {
  ICompanyInformationFormData,
} from '@/app/organisms/CompanyInformationForm';
import Loader from '@/app/components/Loader';
import { Company } from '@/app/types/entities';
import { PAGES } from '@/app/constants/common.const';
import { errorHandler } from '@/app/utils/common';

interface CompanyEditHandlerProps {
  session: string;
}

export default function CompanyEditHandler({
  session,
}: CompanyEditHandlerProps) {
  const params = useParams() as { companyId: string };

  const router = useRouter();

  const handleSubmit = useCallback(
    async (data: ICompanyInformationFormData) => {
      if (session) {
        try {
          const company: Pick<
            Company,
            | 'id'
            | 'companyName'
            | 'companyDiv'
            | 'companyNameKana'
            | 'tel'
            | 'postCd'
            | 'address1'
            | 'address2'
            | 'address3'
          > = {
            id: data.id || '',
            companyName: data.companyName || '',
            companyDiv: data.companyDiv || '',
            companyNameKana: data.companyNameKana || '',
            tel: data.tel || '',
            postCd: data.postCd || '',
            address1: data.address1 || '',
            address2: data.address2 || '',
            address3: data.address3 || '',
          };
          await Companies.edit(company, params.companyId, session);
          router.push(PAGES.COMPANIES);
        } catch (e) {
          console.error(e);
          errorHandler(e, router);
        }
      }
    },
    [session],
  );

  const { data: company, isLoading } = useSWR(
    ['find-a-company', params.companyId],
    () => Companies.find(params.companyId, session),
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
    <CompanyInformationForm
      onSubmit={handleSubmit}
      company={company}
      session={session}
      edit
    />
  );
}
