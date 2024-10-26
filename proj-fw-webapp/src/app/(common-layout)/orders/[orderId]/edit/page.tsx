'use client';

import Loader from '@/app/components/Loader';
import PageHeader from '@/app/components/PageHeader';
import OrderEditHandler from '@/app/molecules/OrderEditHandler';
import { selectMe } from '@/app/selectors/auth';
import { selectOrderDetail } from '@/app/selectors/orders';
import { useAppSelector } from '@/app/store';
import { useSession } from 'next-auth/react';
import React, { Suspense, useMemo } from 'react';

export default function OrderEdit() {
  const orderDetail = useAppSelector(selectOrderDetail);

  const commercialFlowId = useMemo(
    () => orderDetail?.data?.commercialFlowId || '',
    [orderDetail],
  );
  const itemCd = useMemo(() => orderDetail?.data?.itemCd || '', [orderDetail]);

  const { data: user } = useSession();
  const { data: me } = useAppSelector(selectMe);

  return (
    <div className="h-[calc(100vh-64px)] overflow-auto w-full">
      <div className="w-full">
        <PageHeader title="ホーム" />

        {!!me && !!orderDetail?.data && !!user && (
          <Suspense fallback={<Loader />}>
            <OrderEditHandler
              currentUserId={me.mUserId}
              tradingCompany={orderDetail.data?.tradingCompany || ''}
              flowId={commercialFlowId}
              itemCd={itemCd}
              accessToken={user?.user.accessToken || ''}
              companyId={me.companyCd || ''}
              order={orderDetail.data}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
