import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { user, supabaseResponse } = await updateSession(request);

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/sign-up'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If it's a public route, just update session and continue
  if (isPublicRoute) {
    return supabaseResponse;
  }

  // If not logged in, redirect to login
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check onboarding status from user metadata
  const onboardingComplete = user.user_metadata?.onboarding_complete === true;

  // If onboarding not complete and not on onboarding page, redirect to onboarding
  if (!onboardingComplete && pathname !== '/onboarding') {
    const onboardingUrl = new URL('/onboarding', request.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // If onboarding complete and trying to access onboarding page, redirect to home
  if (onboardingComplete && pathname === '/onboarding') {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  // All checks passed, update session and continue
  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
