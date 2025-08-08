// middleware.ts
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { AUTH_ROUTES } from 'routes';
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT } from '../routes';

function readSessionCookie(req: NextRequest) {
  return (
    req.cookies.get('__Secure-next-auth.session-token')?.value ??
    req.cookies.get('next-auth.session-token')?.value ??
    null
  );
}

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  try {
    // quick allow for any API auth endpoints you want to skip
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    if (isApiAuthRoute) return NextResponse.next();

    const isAuthRoute = authRoutes.includes(nextUrl.pathname as any);

    const rawToken = readSessionCookie(req);
    let isLoggedIn = false;
    let payload: Record<string, any> | null = null;

    if (rawToken) {
      const secret = process.env.NEXTAUTH_SECRET;
      if (!secret) {
        console.error('NEXTAUTH_SECRET is not set for Edge runtime');
        // choose conservative fallback: treat as not logged in
      } else {
        try {
          const key = new TextEncoder().encode(secret);
          const verified = await jwtVerify(rawToken, key, { algorithms: ['HS256'] });
          payload = verified.payload as Record<string, any>;
          isLoggedIn = true; // jwtVerify validated signature + exp
        } catch (err) {
          // token invalid/expired
          console.log('JWT verify failed in middleware:', err);
        }
      }
    }

    // if logged in and trying to access root, redirect to your default logged-in page
    if (isLoggedIn && nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    // auth pages (login/register) logic: redirect if already logged in
    if (isAuthRoute) {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return NextResponse.next();
    }

    // not an auth route: require login
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(AUTH_ROUTES.LOGIN, nextUrl));
    }

    // optionally: expose minimal user id to downstream services
    const res = NextResponse.next();
    if (payload?.sub) res.headers.set('x-auth-user-id', String(payload.sub));

    return res;
  } catch (error) {
    console.error('Middleware unexpected error:', error);
    // choose policy: here we redirect to login on error
    return NextResponse.redirect(new URL(AUTH_ROUTES.LOGIN, req.nextUrl));
  }
}

export const config = {
  matcher: ['/((?!_next|api|static|_static|.*\\.(?:png|jpg|jpeg|svg|css|js)).*)'],
};
