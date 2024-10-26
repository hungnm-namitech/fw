'use client';

import { emptyNewEntryFormData } from '@/app/reducers/orders/newOrderFormValue';
import {
  emptyOrderDetailData,
  findOrderDetail,
} from '@/app/reducers/orders/order';
import { useAppDispatch } from '@/app/store';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';

export default function OrderLayout({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const sessionToken = useMemo(() => {
    session?.user.accessToken || '';
  }, [session]);

  const orderId = searchParams.get('orderId');

  const [settingUp, setSettingUp] = useState(true);

  useEffect(() => {
    dispatch(emptyNewEntryFormData());
    if (!orderId) {
      dispatch(emptyOrderDetailData());
      process.nextTick(() => setSettingUp(false));
    } else if (orderId && session?.user.accessToken) {
      dispatch(
        findOrderDetail({ orderId, session: session?.user.accessToken }),
      );
      process.nextTick(() => setSettingUp(false));
    }

    // return () => {
    //   dispatch(emptyNewEntryFormData());
    // };
  }, [dispatch, sessionToken, orderId]);

  if (settingUp) return null;

  return <>{children}</>;
}
