import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTH_PAGES = ['/login', '/signup'];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Debug logging for Vercel logs
  console.log('🔍 Middleware Debug');
  console.log('URL:', req.nextUrl.pathname);
  console.log('Token:', token ? '✅ Token found' : '❌ No token');
  console.log('ENV:', process.env.NODE_ENV);

  const isAuthPage = AUTH_PAGES.includes(url.pathname);
  const isAuthenticated = !!token;

  if (isAuthPage && isAuthenticated) {
    // Prevent logged in users from accessing login/signup
    url.pathname = '/main/home';
    return NextResponse.redirect(url);
  }

  if (!isAuthPage && !isAuthenticated) {
    // Redirect non-authenticated users to login
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/main/:path*', '/login', '/signup'],
};
