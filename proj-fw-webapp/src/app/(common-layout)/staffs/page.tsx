'use client';
import { useSession } from 'next-auth/react';
import PageHeader from '@/app/components/PageHeader';
import StaffListHandler from '../../molecules/StaffListHandler';

export default function StaffList() {
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
        <StaffListHandler session={session.user.accessToken || ''} />
      </div>
    </div>
  );
}
