'use client';

import Loader from '@/app/components/Loader';
import PageHeader from '@/app/components/PageHeader';
import StaffInformationForm, {
  IStaffInformationFormData,
} from '@/app/organisms/StaffInformationForm';
import { useSession } from 'next-auth/react';
import { Suspense, useCallback } from 'react';
import * as Staffs from '@/app/api/entities/staffs';
import { Staff } from '@/app/types/entities';
import { errorHandler, hasAnyRoles } from '@/app/utils/common';
import { STAFF_ROLE } from '@/app/constants/staff.const';
import { useRouter } from 'next/navigation';
import { PAGES } from '@/app/constants/common.const';


export default function CreateStaff() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (data: IStaffInformationFormData) => {
      if (session) {
        try {
          const staff: Omit<Staff, 'id'> = {
            companyCd: data.companyCd || '',
            companyName: data.companyName || '',
            staffName: data.staffName || '',
            staffNameKana: data.staffNameKana || '',
            roleDiv: +(data.authority || 0),
          };
          await Staffs.create(staff, session.user.accessToken || '');
          router.push(PAGES.STAFFS);
        } catch (e) {
          console.error(e);
          errorHandler(e, router);
        }
      }
    },
    [session],
  );

  if (!session) return <></>;

  if (!hasAnyRoles(session, STAFF_ROLE.ADMIN, STAFF_ROLE.FW, STAFF_ROLE.PC))
    return router.push(PAGES.PERMISSION_DENIED);

  return (
    <div className="w-full">
      <PageHeader title="ホーム" />

      <div className="py-[26px] ml-[17px] mr-[17px] ">
        <Suspense fallback={<Loader />}>
          <StaffInformationForm
            onSubmit={handleSubmit}
            session={session.user.accessToken || ''}
          />
        </Suspense>
      </div>
    </div>
  );
}