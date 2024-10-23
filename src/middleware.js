import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;  // Get the current path
  const token = request.cookies.get('token')?.value;  // Get the token from cookies

  // Define public paths that do not require authentication
  const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/successful',
    '/verifyEmail',
    '/forgotpassword',
    '/resetpassword',
  ];

  // Check if the current path is public
  const isPublicPath = publicPaths.includes(path);

  // If the user is on a public path and has a token, redirect them to the dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  // If the user is not on a public path and doesn't have a token, redirect them to the login page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // Allow the request to continue for all other cases
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',  // Include root route
    '/login',
    '/signup',
    '/verifyEmail',
    '/forgotpassword',
    '/resetpassword',
    '/dashboard/:path*',  // Include dynamic routes under dashboard
    '/dashboard,      // Any dynamic route for boards, e.g., /board/[id]
  ],
};
