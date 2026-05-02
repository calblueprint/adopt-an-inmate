'use client';

import z from 'zod';
import Logger from '@/actions/logging';
import { upsertProfile } from '@/actions/queries/profile';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { Profile } from '@/types/schema';

// schema used by useSubmitOnboarding for data validation
const onboardingSchema = z.object({
  firstName: z
    .string({ error: 'Please fill out your first name.' })
    .nonoptional(),
  lastName: z
    .string({ error: 'Please fill out your last name.' })
    .nonoptional(),
  dob: z.date({ error: 'Please fill out your date of birth.' }).nonoptional(),
  pronouns: z.string({ error: 'Please fill out your pronouns.' }).nonoptional(),
  state: z
    .string({ error: 'Please fill out your state of residence.' })
    .nonoptional(),
  isVeteran: z
    .boolean({ error: 'Please fill out your veteran status.' })
    .nonoptional(),
  numPastActive: z.number(),
  pastInactiveReason: z.string(),
});

/**
 * Provides a helper function to submit
 * currently stored onboarding information
 * to Supabase.
 */
export const useSubmitOnboarding = () => {
  const { onboardingInfoRef } = useOnboardingContext();

  const submitOnboardingInfo = async () => {
    let info: z.infer<typeof onboardingSchema>;
    try {
      info = onboardingSchema.parse(onboardingInfoRef.current);
    } catch (error) {
      return { error: String(error) };
    }

    const supabase = getSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      Logger.warn('Attempt made to submit onboarding info without logging in');
      return { error: 'An unexpected error occurred.' };
    }

    const profile: Profile = {
      user_id: user.id,
      date_of_birth: info.dob.toISOString(),
      first_name: info.firstName,
      last_name: info.lastName,
      pronouns: info.pronouns,
      state: info.state,
      veteran_status: info.isVeteran,
      monday_id: null,
      past_inactive_reason: info.pastInactiveReason,
      num_past_active: info.numPastActive,
    };

    await upsertProfile(profile);

    return { error: null };
  };

  return { submitOnboardingInfo };
};
