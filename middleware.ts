import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/digest',
  '/api/checkout'
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
  await auth();
}
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
