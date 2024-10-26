'use client';

import PageHeader from '@/app/components/PageHeader';
import UserInformationForm, {
  IUserInformationFormData,
} from '@/app/organisms/UserInformationForm';
import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import * as Users from '@/app/api/entities/users';
import { User } from '@/app/types/entities';
import { hasAnyRoles } from '@/app/utils/common';
import { USER_ROLE } from '@/app/constants/users.const';
import { useRouter } from 'next/navigation';
import { PAGES } from '@/app/constants/common.const';
import { CommonPageContent } from '@/app/components/CommonPageContent';

export default function CreateUser() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [error, setError] = useState('');

  const handleSubmit = useCallback(
    async (data: IUserInformationFormData) => {
      if (session) {
        setError('');
        try {
          const user: Omit<User, 'mUserId'> = {
            companyId: ![USER_ROLE.ADMIN, USER_ROLE.FW].includes(
              +(data.authority || 0),
            )
              ? (data.company || '').toString()
              : undefined,
            mailAddress: data.email || '',
            password: data.password || '',
            roleDiv: +(data.authority || 0),
            tel: data.phoneNumber || '',
            userId: data.logInId || '',
            username: data.username || '',
            usernameKana: data.usernamePronunciation || '',
          };
          await Users.create(user, session.user.accessToken || '');
          router.push(PAGES.USERS);
          alert('登録されました。');
        } catch (e) {
          if ((e as any).response?.data?.errorCode === 'MAIL_ADDRESS_EXISTS') {
            setError('入力したメールアドレスは既に利用されました。');
          } else if (
            (e as any).response?.data?.errorCode === 'USER_ID_EXISTS'
          ) {
            setError('入力したログインIDは既に利用されました。');
          } else {
            console.error(e);
            alert('Error occurred!');
          }
        }
      }
    },
    [session],
  );

  if (status === 'loading') return <></>;

  if (!hasAnyRoles(session, USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC))
    return router.push(PAGES.PERMISSION_DENIED);

  return (
    <div className="w-full">
      <PageHeader title="ホーム" />

      <CommonPageContent>
        <div className="py-[26px] ml-[17px] mr-[17px] ">
          <UserInformationForm
            title="ユーザー新規登録"
            error={error}
            onSubmit={handleSubmit}
            session={session?.user.accessToken || ''}
            userRole={session?.user.role}
          />
        </div>
      </CommonPageContent>
    </div>
  );
}
