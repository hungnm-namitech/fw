import { getMeThunk } from '@/app/reducers/auth/me';
import { selectMe } from '@/app/selectors/auth';
import { useAppDispatch, useAppSelector } from '@/app/store';
import React, { PropsWithChildren, useEffect } from 'react';
import Loader from '../Loader';
import { useRouter } from 'next/navigation';

export default function MeProvider({
  session,
  children,
}: PropsWithChildren & { session: string }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, data } = useAppSelector(selectMe);

  useEffect(() => {
    dispatch(getMeThunk({ session }));
  }, [session]);

  if (loading) return <Loader />;

  if (error) {
    router.replace('/login');
    return;
  }

  return <>{children}</>;
}
