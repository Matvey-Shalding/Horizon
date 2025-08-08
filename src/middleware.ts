import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { AUTH_ROUTES } from 'routes';
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT } from '../routes';

export async function middleware(req: NextRequest) {
  try {
    const { nextUrl } = req;

    console.log('Next url', nextUrl);

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    console.log('secret code', process.env.NEXTAUTH_SECRET);

    console.log('token', token);

    const isLoggedIn = !!token;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname as any);

    console.log('Is api', isApiAuthRoute);

    console.log('Is auth', isAuthRoute);

    if (isApiAuthRoute) {
      return NextResponse.next();
    }

    if (isLoggedIn && nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    if (isAuthRoute) {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return NextResponse.next();
    }

    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(AUTH_ROUTES.LOGIN, nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Allow request to proceed even if there is an error
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
