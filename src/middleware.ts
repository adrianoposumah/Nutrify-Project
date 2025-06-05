import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/users/')) {
    const token = request.cookies.get('jwt')?.value;

    if (!token) {
      const signinUrl = new URL('/signin', request.url);
      signinUrl.searchParams.set('redirect', pathname);

      return NextResponse.redirect(signinUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/users/:path*'],
};
