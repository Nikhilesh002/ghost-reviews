import { NextResponse, NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"
export { default } from "next-auth/middleware"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Allow public access to /u/form/[id]/review
  if (url.pathname.match(/^\/u\/form\/[^/]+\/review$/)) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (token && (
    url.pathname.startsWith('/signin') ||
    url.pathname.startsWith('/signup') ||
    url.pathname.startsWith('/verify')
  )) {
    return NextResponse.redirect(new URL('/u', request.url));
  }

  // Redirect unauthenticated users trying to access protected routes under /u
  if (!token && url.pathname.startsWith('/u')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  /*
    * Match all request paths except for the ones starting with:
    * - api (API routes)
    * - _next/static (static files)
    * - _next/image (image optimization files)
    * - favicon.ico (favicon file)
    */
  matcher: [
    '/signin',
    '/signup',
    '/u/:path*',
    '/verify/:path*'
  ]
}
