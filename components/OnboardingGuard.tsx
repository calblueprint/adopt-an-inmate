'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Logger from '@/actions/logging';
import { useAuth } from '@/contexts/AuthProvider';
import { getSupabaseBrowserClient } from '@/lib/supabase';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Routes that don't require onboarding check
  const publicRoutes = ['/login', '/signup'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    async function checkOnboardingStatus() {
      // Don't check if user is not logged in
      if (!userId) {
        return;
      }

      // Don't check on public routes (e.g. login, signup)
      if (isPublicRoute) {
        return;
      }

      const supabase = getSupabaseBrowserClient();
      const { data: profile, error } = await supabase
        .from('adopter_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        Logger.error(
          `Error fetching profile for user ${userId}: ${error.message}`,
        );
        return;
      }

      // If profile exists, user has completed onboarding
      if (profile) {
        // If user tries to access /onboarding again, redirect to home
        if (pathname === '/onboarding') {
          router.push('/');
        }
      } else {
        // If user has not completed onboarding, redirect to onboarding for all other routes
        if (pathname !== '/onboarding') {
          router.push('/onboarding');
        }
      }
    }

    checkOnboardingStatus();
  }, [userId, pathname, router, isPublicRoute]);

  return <>{children}</>;
}
