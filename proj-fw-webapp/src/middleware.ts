import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { USER_ROLE } from './lib/constants';

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const conditions = [
    {
      path: '/login',
      check: token,
      redirectTo: '/',
    },
    {
      path: '/item-groups',
      check:
        pathname.startsWith('/item-groups') && token?.role !== USER_ROLE.PC,
      redirectTo: '/403',
    },
    {
      path: '/users',
      check:
        pathname.includes('/users') &&
        token?.role !== USER_ROLE.ADMIN &&
        token?.role !== USER_ROLE.FW,
      redirectTo: '/403',
    },
    {
      path: '/suppliers',
      check:
        pathname.includes('/suppliers') &&
        token?.role !== USER_ROLE.ADMIN &&
        token?.role !== USER_ROLE.FW,
      redirectTo: '/403',
    },
    {
      path: '/companies',
      check:
        pathname.includes('/companies') &&
        token?.role !== USER_ROLE.ADMIN &&
        token?.role !== USER_ROLE.FW,
      redirectTo: '/403',
    },
    {
      path: '/staffs',
      check:
        pathname.includes('/staffs') &&
        token?.role !== USER_ROLE.ADMIN &&
        token?.role !== USER_ROLE.FW &&
        token?.role !== USER_ROLE.PC,
      redirectTo: '/403',
    },
    {
      path: '/bases',
      check:
        pathname.includes('/bases') &&
        token?.role !== USER_ROLE.ADMIN &&
        token?.role !== USER_ROLE.FW &&
        token?.role !== USER_ROLE.PC,
      redirectTo: '/403',
    },
  ];
  if (!token && !pathname.includes('/login')) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
  for (const condition of conditions) {
    if (pathname.startsWith(condition.path) && condition.check) {
      return NextResponse.redirect(
        new URL(condition.redirectTo, request.nextUrl),
      );
    }
  }
}
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|health|.*\\..*).*)',
};
