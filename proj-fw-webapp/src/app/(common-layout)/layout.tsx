'use client';

import { PropsWithChildren, useEffect } from 'react';
import CommonLayout from '@/app/molecules/CommonLayout';
import { SWRConfig } from 'swr';
import { useSession } from 'next-auth/react';
import Loader from '../components/Loader';
import MeProvider from '../components/MeProvider';

export default function RootLayout({ children }: PropsWithChildren) {
  const { data, status } = useSession();

  if (status === 'loading') return <Loader />;

  return (
    <CommonLayout>
      <MeProvider session={data?.user.accessToken || ''}>
        <SWRConfig value={{ revalidateOnFocus: false }}>
          <div className="w-full h-[100vh] flex bg-zinc-50	">{children}</div>
        </SWRConfig>
      </MeProvider>
    </CommonLayout>
  );
}
