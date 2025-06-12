import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface JWTPayload {
  id: string;
  role?: string; // Make role optional since it's not in the JWT
  iat: number;
  exp: number;
}

// Simple JWT decode function for middleware
function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch {
    return null;
  }
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

    console.log('Access granted to dashboard');
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
        console.log('Token found:', token ? token.substring(0, 20) + '...' : 'No token');

        const decoded = decodeJWT(token);
        console.log('Decoded JWT:', decoded);

        if (!decoded) {
          console.log('Failed to decode JWT, redirecting to signin');
          const signinUrl = new URL('/signin', request.url);
          signinUrl.searchParams.set('redirect', pathname);
          return NextResponse.redirect(signinUrl);
        }

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          console.log('Token expired, redirecting to signin');
          const signinUrl = new URL('/signin', request.url);
          signinUrl.searchParams.set('redirect', pathname);
          return NextResponse.redirect(signinUrl);
        }

        // Since JWT doesn't contain role, we need to check it differently
        // For now, let's store the role in a separate cookie when user logs in
        const userRole = request.cookies.get('user_role')?.value;
        console.log('User role from cookie:', userRole);

        // Check if user has admin or moderator role
        if (!userRole || (userRole !== 'admin' && userRole !== 'moderator')) {
          console.log('Access denied to pending route:', {
            role: userRole,
            required: 'admin or moderator',
          });
          return NextResponse.redirect(new URL('/users/profile', request.url));
        }

        console.log('Access granted to pending route');
      } catch (error) {
        console.log('Error processing JWT:', error);
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
