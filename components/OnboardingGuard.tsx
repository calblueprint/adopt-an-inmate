'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import { getSupabaseBrowserClient } from '@/lib/supabase';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  // Routes that don't require onboarding check
  const publicRoutes = ['/login', '/signup'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    async function checkOnboardingStatus() {
      console.log('OnboardingGuard - Starting check', {
        userId,
        pathname,
        isPublicRoute,
      });

      // Don't check if user is not logged in
      if (!userId) {
        console.log('OnboardingGuard - No userId, skipping check');
        setIsChecking(false);
        return;
      }

      // Don't check on public routes like login/signup
      if (isPublicRoute) {
        console.log('OnboardingGuard - Public route, skipping check');
        setIsChecking(false);
        return;
      }

      try {
        const supabase = getSupabaseBrowserClient();
        const { data: profile, error } = await supabase
          .from('adopter_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        console.log('OnboardingGuard - Profile check:', {
          userId,
          pathname,
          profileExists: !!profile,
          profile,
          error,
        });

        // If profile exists, user has completed onboarding
        if (profile) {
          // If they're trying to access /onboarding, redirect to home
          if (pathname === '/onboarding') {
            console.log(
              'OnboardingGuard - Redirecting completed user from /onboarding to /',
            );
            router.push('/');
          }
        } else {
          // No profile means onboarding not complete
          if (pathname !== '/onboarding') {
            console.log(
              'OnboardingGuard - Redirecting incomplete user to /onboarding',
            );
            router.push('/onboarding');
          }
        }
      } catch (error) {
        console.log('OnboardingGuard - Error fetching profile:', error);
        // If there's an error, treat it as onboarding not complete
        if (pathname !== '/onboarding') {
          router.push('/onboarding');
        }
      } finally {
        setIsChecking(false);
      }
    }

    checkOnboardingStatus();
  }, [userId, pathname, router, isPublicRoute]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
}
