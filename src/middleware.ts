import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  id: string;
  role: string;
  exp: number;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('jwt')?.value;
    console.log('Dashboard access attempt:', { pathname, hasToken: !!token });

    if (!token) {
      console.log('No token found, redirecting to signin');
      const signinUrl = new URL('/signin', request.url);
      signinUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signinUrl);
    }

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      console.log('Decoded token:', { role: decoded.role, exp: decoded.exp, id: decoded.id });

      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        console.log('Token expired, redirecting to signin');
        const signinUrl = new URL('/signin', request.url);
        signinUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(signinUrl);
      }

      console.log('Access granted to dashboard (role checking disabled until backend fix)');
    } catch (error) {
      console.log('Token decode error:', error);
      // Invalid token, redirect to signin
      const signinUrl = new URL('/signin', request.url);
      signinUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signinUrl);
    }
  }

  if (pathname.startsWith('/users/')) {
    const token = request.cookies.get('jwt')?.value;

    if (!token) {
      const signinUrl = new URL('/signin', request.url);
      signinUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signinUrl);
    }

    // Role-based protection for pending route
    if (pathname.startsWith('/users/pending')) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          const signinUrl = new URL('/signin', request.url);
          signinUrl.searchParams.set('redirect', pathname);
          return NextResponse.redirect(signinUrl);
        }

        // Check if user has admin or moderator role
        if (!decoded.role || (decoded.role !== 'admin' && decoded.role !== 'moderator')) {
          // Redirect to dashboard or show access denied
          return NextResponse.redirect(new URL('/users/profile', request.url));
        }
      } catch {
        // Invalid token, redirect to signin
        const signinUrl = new URL('/signin', request.url);
        signinUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(signinUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/users/:path*', '/dashboard/:path*'],
};
