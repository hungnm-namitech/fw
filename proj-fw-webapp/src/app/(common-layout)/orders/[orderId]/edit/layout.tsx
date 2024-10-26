'use client';

import Loader from '@/app/components/Loader';
import { emptyNewEntryFormData } from '@/app/reducers/orders/newOrderFormValue';
import { findOrderDetail } from '@/app/reducers/orders/order';
import { selectOrderDetail } from '@/app/selectors/orders';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';

export default function OrderEditLayout({ children }: PropsWithChildren) {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: session } = useSession();

  const orderDetail = useAppSelector(selectOrderDetail);
  const dispatch = useAppDispatch();

  const [settingUp, setSettingUp] = useState(true);

  const sessionToken = useMemo(() => {
    session?.user.accessToken || '';
  }, [session]);

  useEffect(() => {
    (async () => {
      if (orderId && session?.user.accessToken) {
        await dispatch(
          findOrderDetail({ orderId, session: session?.user.accessToken }),
        );

        setSettingUp(false);
      }
    })();
  }, [dispatch, sessionToken, orderId]);

  useEffect(() => {
    dispatch(emptyNewEntryFormData());
  }, [dispatch]);

  if (orderDetail?.loading || settingUp) return <Loader />;
  else if (orderDetail?.error) return <p>Oops, something went wrong!</p>;

  return <>{children}</>;
}
