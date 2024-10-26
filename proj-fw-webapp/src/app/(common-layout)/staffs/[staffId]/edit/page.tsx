'use client';

import PageHeader from '@/app/components/PageHeader';
import { PAGES } from '@/app/constants/common.const';
import { STAFF_ROLE } from '@/app/constants/staff.const';
import StaffEditHandler from '@/app/molecules/StaffEditHandler';
import { hasAnyRoles } from '@/app/utils/common';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function EditStaff() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) return <></>;

  if (!hasAnyRoles(session, STAFF_ROLE.ADMIN, STAFF_ROLE.FW, STAFF_ROLE.PC))
    return router.push(PAGES.PERMISSION_DENIED);

  return (
    <div className="w-full">
      <PageHeader title="ホーム" />

      <div className="py-[26px] ml-[17px] mr-[17px] ">
        <StaffEditHandler session={session.user.accessToken || ''} />
      </div>
    </div>
  );
}
