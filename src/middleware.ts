import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { AUTH_ROUTES } from 'routes';
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT } from '../routes';

export async function middleware(req: NextRequest) {

  const SECRET_CODE = 'FTkAz0ygsRoEfwpY7ykEVR0mw+o3Pu40Pz6QewMbrL4=';

  try {
    const { nextUrl } = req;

    console.log('Next url', nextUrl);

    const token = await getToken({ req, secret: SECRET_CODE });

    console.log('secret code', SECRET_CODE);

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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|media|fonts|favicon.ico|favicon.png).*)',
      missing: [
        // Exclude Server Actions
        { type: 'header', key: 'next-action' },
      ],
    },
  ],
};
