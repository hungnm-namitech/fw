'use client';

import { ICONS } from '@/app/assets/icons';
import Loader from '@/app/components/Loader';
import PageHeader from '@/app/components/PageHeader';
import { Tabs } from '@/app/components/Tabs';
import { USER_ROLE } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

interface CreateOrderCompletionProps {}

export default function CreateOrderCompletion(
  props: CreateOrderCompletionProps,
) {
  const { data } = useSession();
  const router = useRouter();

  if (status === 'loading') return <Loader />;

  if (!data?.user.role || data?.user.role !== USER_ROLE.PC) {
    router.push('/403');
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-card  overflow-auto w-full">
      <div className="w-full ">
        <PageHeader title="ホーム" />

        <div className="mt-[53px] ml-[159px] mr-[177px]">
          <Tabs
            tabs={[
              { label: '発注内容入力', value: 0 },
              { label: '発注内容確認', value: 1 },
              { label: '発注依頼完了', value: 2 },
            ]}
            value={2}
            tabClassName="w-[33.33%]"
          />
        </div>

        <div className="flex items-center flex-col justify-center pt-[80px]">
          <Image src={ICONS.WOOD_LARGE_ICON} alt="Wood" height="190" />

          <p className="font-noto-sans-jp text-4xl font-bold leading-[125%] text-text-black mt-[39px]">
            登録が完了しました
          </p>

          <Link
            href={'/orders'}
            className=" mt-[40px] font-noto-sans-jp text-md font-bold leading-[125%]  text-center w-[360px] rounded-[4px] py-[17px] shadow-sm px-[20px] bg-primary text-dark-primary-contrast "
          >
            一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
