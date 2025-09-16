import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isAuthenticatedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAuthenticatedRoute(req)) {
    await auth.protect();
  }
})

export const config = {
  // Recommended matcher: run middleware on all app routes (excluding static)
  // and API routes so Clerk can detect the middleware, while we selectively
  // call auth.protect() only for dashboard via createRouteMatcher above.
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)'
  ],
};