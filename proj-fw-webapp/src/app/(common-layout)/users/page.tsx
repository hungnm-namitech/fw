'use client';
import { useSession } from 'next-auth/react';
import PageHeader from '@/app/components/PageHeader';
import UserListHandler from '@/app/molecules/UserListHandler';

export default function UserList() {
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

      <div className="pt-[20px] pb-[23px] px-[24px]">
        <UserListHandler
          session={session.user.accessToken || ''}
          role={session.user.role}
        />
      </div>
    </div>
  );
}
