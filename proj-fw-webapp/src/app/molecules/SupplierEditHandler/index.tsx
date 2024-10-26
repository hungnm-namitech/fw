'use client';

import React, { useCallback } from 'react';
import useSWR from 'swr';
import * as Suppliers from '@/app/api/entities/suppliers';
import { useParams, useRouter } from 'next/navigation';
import SupplierInformationForm, {
  ISupplierInformationFormData,
} from '@/app/organisms/SupplierInformationForm';
import Loader from '@/app/components/Loader';
import { Supplier } from '@/app/types/entities';
import { PAGES } from '@/app/constants/common.const';
import { errorHandler } from '@/app/utils/common';

interface SupplierEditHandlerProps {
  session: string;
}

export default function SupplierEditHandler({ session }: SupplierEditHandlerProps) {
  const params = useParams() as { supplierId: string };

  const router = useRouter();

  const handleSubmit = useCallback(
    async (data: ISupplierInformationFormData) => {
      if (session) {
        try {
          const supplier: Pick<
            Supplier,
            | 'supplierCd'
            | 'supplierName'
            | 'supplierNameKana'
            | 'tel'
            | 'postCd'
            | 'address1'
            | 'address2'
            | 'address3'
          > = {
            supplierCd: data.supplierCd || '',
            supplierName: data.supplierName || '',
            supplierNameKana: data.supplierNameKana || '',
            tel: data.tel || '',
            postCd: data.postCd || '',
            address1: data.address1 || '',
            address2: data.address2 || '',
            address3: data.address3 || '',
          };
          await Suppliers.edit(supplier, params.supplierId, session);
          alert('更新されました。');
          router.push(PAGES.SUPPLIERS);
        } catch (e) {
          console.error(e);
          errorHandler(e, router);
        }
      }
    },
    [session],
  );

  const { data: supplier, isLoading } = useSWR(
    ['find-a-supplier', params.supplierId],
    () => Suppliers.find(params.supplierId, session),
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
    <SupplierInformationForm
      onSubmit={handleSubmit}
      supplier={supplier}
      session={session}
      edit
    />
  );
}
