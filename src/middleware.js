import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('token')?.value;
  const userCookie = request.cookies.get('user')?.value;

  let user = null;
  try {
    user = userCookie ? JSON.parse(userCookie) : null;
  } catch (err) {
    user = null;
  }

  if (pathname === '/login') {
    if (token && user) {
      if (user.role === 'Super Admin') {
        return NextResponse.redirect(
          new URL('/dashboard/dashboard', request.url)
        );
      }

      if (user.role === 'Admin') {
        return NextResponse.redirect(
          new URL('/dashboard/admin-dashboard', request.url)
        );
      }

      return NextResponse.redirect(
        new URL('/dashboard', request.url)
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/dashboard')) {
    if (!token || !user) {
      return NextResponse.redirect(
        new URL('/login', request.url)
      );
    }

    if (user.role === 'Super Admin' && pathname === '/dashboard') {
      return NextResponse.redirect(
        new URL('/dashboard/dashboard', request.url)
      );
    }

    if (user.role === 'Admin' && pathname === '/dashboard') {
      return NextResponse.redirect(
        new URL('/dashboard/admin-dashboard', request.url)
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/dashboard/:path*',
  ],
};