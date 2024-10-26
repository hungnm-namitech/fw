'use client';

import React, { useMemo } from 'react';

import OrderConfirmationHandler from '@/app/organisms/OrderConfirmationHandler';
import { useSession } from 'next-auth/react';
import Loader from '@/app/components/Loader';
import { useRouter, useSearchParams } from 'next/navigation';
import { USER_ROLE } from '@/lib/constants';
import { useAppSelector } from '@/app/store';
import { selectMe } from '@/app/selectors/auth';
import { selectOrderDetail } from '@/app/selectors/orders';

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderDetail = useAppSelector(selectOrderDetail);

  const flowId = searchParams.get('flowId');
  const itemGroupId = searchParams.get('itemGroupId');
  const tradingCompany = searchParams.get('tradingCompany');
  const orderId = searchParams.get('orderId');

  const commercialFlowId = useMemo(
    () => orderDetail?.data?.commercialFlowId || '',
    [orderDetail],
  );

  const itemCd = useMemo(() => orderDetail?.data?.itemCd || '', [orderDetail]);

  const trading = useMemo(
    () => orderDetail?.data?.tradingCompany || '',
    [orderDetail],
  );

  const { data } = useSession();

  const { data: me } = useAppSelector(selectMe);

  const router = useRouter();

  if (status === 'loading') return <Loader />;

  if (!data?.user.role || data?.user.role !== USER_ROLE.PC) {
    router.push('/403');

    return;
  }

  return (
    <>
      {orderId ? (
        <OrderConfirmationHandler
          username={me?.username || ''}
          accessToken={data.user.accessToken || ''}
          companyId={me?.companyCd || ''}
          flowId={commercialFlowId || ''}
          itemGroupId={itemCd || ''}
          tradingCompany={trading || ''}
        />
      ) : (
        <OrderConfirmationHandler
          username={me?.username || ''}
          accessToken={data.user.accessToken || ''}
          companyId={me?.companyCd || ''}
          flowId={flowId || ''}
          itemGroupId={itemGroupId || ''}
          tradingCompany={tradingCompany || ''}
        />
      )}
    </>
  );
}
