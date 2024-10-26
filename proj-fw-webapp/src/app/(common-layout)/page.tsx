'use client';

import PageHeader from '@/app/components/PageHeader';
import ToppageMenu from '@/app/molecules/ToppageMenu';
import ToppageNotifications from '@/app/molecules/ToppageNotifications';
import { CommonPageContent } from '../components/CommonPageContent';
import { useSession } from 'next-auth/react';
import Loader from '../components/Loader';

export default function Home() {
  const { data, status } = useSession();

  if (status === 'loading') return <Loader />;

  return (
    <div className="w-full">
      <PageHeader title="ホーム" />

      <CommonPageContent>
        <div className="mt-[15px] pt-[31px] mr-[24px] ml-[25px] bg-card mb-[29px]">
          <ToppageNotifications accessToken={data?.user.accessToken} />

          <div className="mt-18 pb-[54px]">
            <ToppageMenu role={+(data?.user.role || '')} />
          </div>
        </div>
      </CommonPageContent>
    </div>
  );
}
