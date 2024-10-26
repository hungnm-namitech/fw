'use client';
import { TIMEOUT_MAX } from '@/app/constants/timeOut.const';
import { getCurrentTimeInSeconds } from '@/app/utils/timeUtils';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect, useState } from 'react';

export default function AuthProvider({ children }: PropsWithChildren) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
    const currentTimeOut = getCurrentTimeInSeconds().toString();
    localStorage.setItem('timeOutWebsite', currentTimeOut);
    localStorage.setItem('beforeUnload', 'false');

    return;
  };
  const isRememberMe = () => {
    const beforeUnload = localStorage.getItem('beforeUnload');
    return beforeUnload === 'false' && !session?.user?.rememberMe;
  };
  const isLogoutDueToMaxTime = () => {
    let userInactivityDuration: number | undefined;
    const lastTimeOutLocal = localStorage.getItem('timeOutWebsite');
    const timeInWebsite = getCurrentTimeInSeconds();
    if (lastTimeOutLocal) {
      userInactivityDuration = timeInWebsite - parseInt(lastTimeOutLocal);
    }
    return (
      userInactivityDuration !== undefined &&
      userInactivityDuration > TIMEOUT_MAX
    );
  };
  const shouldLogout = () => {
    if (pathname === '/login') return false;
    const shouldForceLogout = isRememberMe() && isLogoutDueToMaxTime();
    return shouldForceLogout;
  };
  const logOutIfNeeded = async () => {
    if (shouldLogout()) {
      await signOut({ redirect: false });
      localStorage.removeItem('beforeUnload');
      localStorage.removeItem('timeOutWebsite');
      router.replace('/login');
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (status !== 'loading') {
      logOutIfNeeded();
    }
  }, [status, pathname]);
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [status]);
  if (status == 'loading' || loading) {
    return (
      <body>
        <div>Loading...</div>
      </body>
    );
  }
  return children;
}
