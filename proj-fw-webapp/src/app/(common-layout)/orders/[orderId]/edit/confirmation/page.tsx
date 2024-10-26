'use client';

import Loader from '@/app/components/Loader';
import OrderConfirmationHandler from '@/app/organisms/OrderConfirmationHandler';
import { selectMe } from '@/app/selectors/auth';
import { selectOrderDetail } from '@/app/selectors/orders';
import { useAppSelector } from '@/app/store';
import { USER_ROLE } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function OrderEditConfirmation() {
  const orderDetail = useAppSelector(selectOrderDetail);
  const { data } = useSession();

  const { data: me } = useAppSelector(selectMe);
  const router = useRouter();

  if (status === 'loading') return <Loader />;

  if (!data?.user.role || data?.user.role !== USER_ROLE.PC) {
    router.push('/403');

    return;
  }

  return (
    <OrderConfirmationHandler
      username={me?.username || ''}
      accessToken={data.user.accessToken || ''}
      companyId={me?.companyCd || ''}
      flowId={orderDetail?.data?.commercialFlowId || ''}
      itemGroupId={orderDetail?.data?.itemCd || ''}
      tradingCompany={orderDetail?.data?.tradingCompany || ''}
      order={orderDetail?.data || undefined}
    />
  );
}
