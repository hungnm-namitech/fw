'use client';
import { useSession } from 'next-auth/react';
import PageHeader from '@/app/components/PageHeader';
import BaseListHandler from '@/app/molecules/BaseListHandler';

export default function BaseList() {
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

      <div className="py-[26px] ml-[17px] mr-[17px] ">
        <BaseListHandler session={session.user.accessToken || ''} />
      </div>
    </div>
  );
}
