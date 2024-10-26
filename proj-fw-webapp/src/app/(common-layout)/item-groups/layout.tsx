'use client';

import Loader from '@/app/components/Loader';
import { useSession } from 'next-auth/react';
import React, { PropsWithChildren } from 'react';

export default function ItemGroupsLayout({ children }: PropsWithChildren) {
  const { status } = useSession();

  if (status === 'loading') return <Loader />;

  return <>{children}</>;
}
