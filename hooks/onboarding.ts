'use client';

import z from 'zod';
import Logger from '@/actions/logging';
import { upsertProfile } from '@/actions/queries/profile';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { Profile } from '@/types/schema';
import { OnboardingInfo } from '@/types/types';

// schema used by useSubmitOnboarding for data validation
const onboardingSchema = z.object({
  firstName: z.string().nonoptional(),
  lastName: z.string().nonoptional(),
  dob: z.date().nonoptional(),
  pronouns: z.string().nonoptional(),
  state: z.string().nonoptional(),
  isVeteran: z.boolean().nonoptional(),
});

/**
 * Provides a helper function to submit
 * currently stored onboarding information
 * to Supabase.
 */
export const useSubmitOnboarding = () => {
  const { onboardingInfoRef } = useOnboardingContext();

  const submitOnboardingInfo = async () => {
    const info: OnboardingInfo = onboardingSchema.parse(
      onboardingInfoRef.current,
    );

    const supabase = getSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      Logger.warn('Attempt made to submit onboarding info without logging in');
      return;
    }

    const profile: Profile = {
      user_id: user.id,
      date_of_birth: info.dob.toUTCString(),
      first_name: info.firstName,
      last_name: info.lastName,
      pronouns: info.pronouns,
      state: info.state,
      veteran_status: info.isVeteran,
    };

    await upsertProfile(profile);
  };

  return { submitOnboardingInfo };
};
