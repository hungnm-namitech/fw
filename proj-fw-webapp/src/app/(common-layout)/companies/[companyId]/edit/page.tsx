'use client';

import { CommonPageContent } from '@/app/components/CommonPageContent';
import PageHeader from '@/app/components/PageHeader';
import { PAGES } from '@/app/constants/common.const';
import { USER_ROLE } from '@/app/constants/users.const';
import CompanyEditHandler from '@/app/molecules/CompanyEditHandler';
import { hasAnyRoles } from '@/app/utils/common';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function EditCompany() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) return <></>;

  if (!hasAnyRoles(session, USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC))
    return router.push(PAGES.PERMISSION_DENIED);

  return (
    <div className="w-full">
      <PageHeader title="ホーム" />

      <CommonPageContent>
        <div className="py-[26px] ml-[17px] mr-[17px] ">
          <CompanyEditHandler session={session.user.accessToken || ''} />
        </div>
      </CommonPageContent>
    </div>
  );
}
