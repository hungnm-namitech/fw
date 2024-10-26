'use client';

import Loader from '@/app/components/Loader';
import PageHeader from '@/app/components/PageHeader';
import BaseInfomationForm, {
  IBaseInformationFormData,
} from '@/app/organisms/BaseInformationForm';
import { useSession } from 'next-auth/react';
import { Suspense, useCallback } from 'react';
import * as Bases from '@/app/api/entities/base';
import { Base } from '@/app/types/entities';
import { errorHandler, hasAnyRoles } from '@/app/utils/common';
import { USER_ROLE } from '@/app/constants/users.const';
import { useRouter } from 'next/navigation';
import { PAGES } from '@/app/constants/common.const';

export default function CreateBase() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (data: IBaseInformationFormData) => {
      if (session) {
        try {
          const base = {
            id: data.id || "",
            baseName: data.baseName || "",
            baseNameKana: data.baseNameKana || "",
            companyCd: data.companyCd || "",
            telNumber: data.telNumber || "",
            postCode: data.postCode || "",
            address1: data.address1 || "",
            address2: data.address2 || "",
            address3: data.address3 || "",
            baseDiv: "", // add this line
          };
          await Bases.create(base, session.user.accessToken || '');
          router.push(PAGES.BASES);
        } catch (e) {
          console.error(e);
          errorHandler(e, router);
        }
      }
    },
    [session],
  );

  if (!session) return <></>;

  if (!hasAnyRoles(session, USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC))
    return router.push(PAGES.PERMISSION_DENIED);

  return (
    <div className="w-full">
      <PageHeader title="ホーム" />

      <div className="py-[26px] ml-[17px] mr-[17px] ">
        <Suspense fallback={<Loader />}>
          <BaseInfomationForm
            onSubmit={handleSubmit}
            session={session.user.accessToken || ''}
          />
        </Suspense>
      </div>
    </div>
  );
}
