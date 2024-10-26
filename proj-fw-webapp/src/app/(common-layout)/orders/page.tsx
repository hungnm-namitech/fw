'use client';
import { useSession } from 'next-auth/react';
import PageHeader from '@/app/components/PageHeader';
import OrderListHandlerPC from '@/app/molecules/OrderListHandlerPC';
import { USER_ROLE } from '@/lib/constants';
import OrderListHandlerSupplier from '@/app/molecules/OrderListHandlerSupplier';
import OrderListHandlerFW from '@/app/molecules/OrderListHandlerFW';

export default function UserList() {
  const { data: session } = useSession();
  if (!session?.user.accessToken)
    return (
      <div className="w-full">
        <PageHeader title="ホーム" />
      </div>
    );

  return (
    <div className="overflow-auto w-full">
      <div className="w-full">
        <PageHeader title="ホーム" />

        <div className="h-[calc(100vh-64px)] py-[26px] ml-[17px] mr-[17px] relative ">
          {session?.user?.role === USER_ROLE.PC && (
            <OrderListHandlerPC
              session={session.user.accessToken || ''}
              role={session?.user?.role}
            />
          )}
          {session?.user?.role === USER_ROLE.ADMIN && (
            <OrderListHandlerSupplier
              session={session.user.accessToken || ''}
              role={session?.user?.role}
            />
          )}
          {session?.user?.role === USER_ROLE.FW && (
            <OrderListHandlerSupplier
              session={session.user.accessToken || ''}
              role={session?.user?.role}
            />
          )}
          {session?.user?.role === USER_ROLE.SUPPLIER && (
            <OrderListHandlerSupplier
              session={session.user.accessToken || ''}
              role={session?.user?.role}
              showResponseButton
            />
          )}
        </div>
      </div>
    </div>
  );
}
