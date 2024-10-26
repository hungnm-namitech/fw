'use client';

import Loader from '@/app/components/Loader';
import PageHeader from '@/app/components/PageHeader';
import OrderCreateHandler from '@/app/organisms/OrderCreateHandler';
import { selectMe } from '@/app/selectors/auth';
import { selectOrderDetail } from '@/app/selectors/orders';
import { useAppSelector } from '@/app/store';
import { USER_ROLE } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

import React, { Suspense, useMemo } from 'react';

export default function NewEntryOrder() {
  const orderDetail = useAppSelector(selectOrderDetail);
  const { data, status } = useSession();
  const searchParams = useSearchParams();
  const { data: me } = useAppSelector(selectMe);
  const commercialFlowId = useMemo(
    () => orderDetail?.data?.commercialFlowId || '',
    [orderDetail],
  );

  const itemCd = useMemo(() => orderDetail?.data?.itemCd || '', [orderDetail]);

  const trading = useMemo(
    () => orderDetail?.data?.tradingCompany || '',
    [orderDetail],
  );
  const router = useRouter();
  if (status === 'loading') return <Loader />;

  if (!data?.user.role || data?.user.role !== USER_ROLE.PC) {
    router.push('/403');
    return;
  }

  const companyId = me?.companyCd;
  const flowId = searchParams.get('flowId');
  const itemGroupId = searchParams.get('itemGroupId');
  const tradingCompany = searchParams.get('tradingCompany');
  const orderId = searchParams.get('orderId');

  if (orderId) {
    return (
      <div
        className="h-[calc(100vh-64px)] overflow-auto w-full"
        data-scroll-error="scroll-error"
      >
        <div className="w-full">
          <PageHeader title="ホーム" />

          {!orderDetail?.loading && (
            <Suspense fallback={<div>Loading...</div>}>
              <OrderCreateHandler
                currentUserId={data.user.id || ''}
                flowId={+commercialFlowId}
                accessToken={data?.user.accessToken || ''}
                companyId={+(companyId || '')}
                itemGroupId={+itemCd}
                tradingCompany={trading || ''}
                order={orderDetail.data || undefined}
                orderId={orderId}
              />
            </Suspense>
          )}
        </div>
      </div>
    );
  }
  if (!companyId || !flowId || !itemGroupId) return router.push('/404');
  return (
    <div
      className="h-[calc(100vh-64px)] overflow-auto w-full"
      data-scroll-error="scroll-error"
    >
      <div className="w-full">
        <PageHeader title="ホーム" />

        <Suspense fallback={<div>Loading...</div>}>
          <OrderCreateHandler
            currentUserId={data.user.id || ''}
            flowId={+flowId}
            accessToken={data?.user.accessToken || ''}
            companyId={+companyId}
            itemGroupId={+itemGroupId}
            tradingCompany={tradingCompany || ''}
          />
        </Suspense>
      </div>
    </div>
  );
}
