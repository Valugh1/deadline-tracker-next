import { auth } from '@/lib/auth/server';

export default auth.middleware({
  loginUrl: '/auth/sign-in',
});

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - auth routes (/auth/*)
     * - static files (_next/static, _next/image, favicon, etc.)
     * - api/auth (the Neon Auth API handler)
     */
    '/((?!auth|api|_next/static|_next/image|favicon.ico|globals.css).*)',
  ],
};