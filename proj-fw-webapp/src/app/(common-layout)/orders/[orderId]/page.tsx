'use client';
import PageHeader from '@/app/components/PageHeader';
import React from 'react';
import { CommonPageContent } from '@/app/components/CommonPageContent';
import OrderDetailsContent from '@/app/molecules/OrderDetailsContent';
import { useSession } from 'next-auth/react';
import { useAppSelector } from '@/app/store';
import { selectMe } from '@/app/selectors/auth';
import { USER_ROLE } from '@/lib/constants';

export default function OrderDetails() {
  const { data: me } = useAppSelector(selectMe);
  const { data: session } = useSession();
  if (!session?.user.accessToken)
    return (
      <div className="w-full">
        <PageHeader title="ホーム" />
      </div>
    );
  return (
    <div className="w-full">
      <PageHeader title="ホーム" />
      <CommonPageContent>
        <div className="pt-[15px] pl-[17px] pr-[23px]">
          <OrderDetailsContent
            session={session.user.accessToken || ''}
            role={session?.user?.role as USER_ROLE}
          />
        </div>
      </CommonPageContent>
    </div>
  );
}
