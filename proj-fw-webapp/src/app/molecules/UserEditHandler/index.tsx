'use client';

import React, { useCallback } from 'react';
import useSWR from 'swr';
import * as Users from '@/app/api/entities/users';
import { useParams, useRouter } from 'next/navigation';
import UserInformationForm, {
  IUserInformationFormData,
} from '@/app/organisms/UserInformationForm';
import Loader from '@/app/components/Loader';
import { User } from '@/app/types/entities';
import { PAGES } from '@/app/constants/common.const';

interface UserEditHandlerProps {
  session: string;
  userRole?: number;
}

export default function UserEditHandler({
  session,
  userRole,
}: UserEditHandlerProps) {
  const params = useParams() as { userId: string };

  const router = useRouter();

  const handleSubmit = useCallback(
    async (data: IUserInformationFormData) => {
      if (session) {
        try {
          const user: Pick<
            User,
            | 'username'
            | 'usernameKana'
            | 'mailAddress'
            | 'tel'
            | 'roleDiv'
            | 'companyId'
          > = {
            companyId: data.company || '',
            mailAddress: data.email || '',
            roleDiv: +(data.authority || 0),
            tel: data.phoneNumber || '',
            username: data.username || '',
            usernameKana: data.usernamePronunciation || '',
          };
          await Users.edit(user, params.userId, session);
          alert('更新されました。');
          router.push(PAGES.USERS);
        } catch (e) {
          console.error(e);
          alert('Error occurred!');
        }
      }
    },
    [session],
  );

  const { data: user, isLoading } = useSWR(
    ['find-a-user', params.userId],
    () => Users.find(params.userId, session),
    {
      onError: err => {
        if (err.response.status === 404) {
          router.push('/404');
          return;
        }
        throw err;
      },
    },
  );

  if (isLoading) return <Loader />;

  return (
    <UserInformationForm
      title="ユーザー情報更新"
      onSubmit={handleSubmit}
      user={user}
      session={session}
      edit
      userRole={userRole}
    />
  );
}
