import { NextResponse,NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token=await getToken({req:request});
  const url=request.nextUrl;
  if(token && (
    url.pathname.startsWith('/signin') ||
    url.pathname.startsWith('/signup') ||
    url.pathname.startsWith('/verify') ||
    url.pathname.startsWith('/') 
  )){
    return NextResponse.redirect(new URL('/dashboard',request.url));
  }
  return NextResponse.redirect(new URL('/home', request.url));
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
    '/dashboard/:path*',
    '/',
    '/verify/:path*'
  ]
}