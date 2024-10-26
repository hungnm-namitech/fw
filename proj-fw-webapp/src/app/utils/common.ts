import { Session } from 'next-auth';
import { PAGES } from '../constants/common.const';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const hasAnyRoles = (
  session: Session | null,
  ...requireRoles: number[]
) => {
  if (!session?.user?.role) return false;

  return !!requireRoles.find(r => session.user.role === r);
};

export const errorHandler = (error: any, router: AppRouterInstance) => {
  if (error.response.status === 404) {
    return router.push(PAGES.NOT_FOUND);
  } else if (error.response.status === 403) {
    return router.push(PAGES.PERMISSION_DENIED);
  }

  throw error;
};

export const formatDateFilterToISOString = (date?: Date) => {
  return date ? date.toISOString() : null;
};
