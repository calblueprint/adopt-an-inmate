import { FormState } from '@/types/types';

export function formatGenderPreference(
  genderPreference?: FormState['genderPreference'],
) {
  if (!genderPreference) return 'N/A';

  const mapper: Record<typeof genderPreference, string> = {
    female: 'Female',
    male: 'Male',
    no_preference: 'No preference',
  };

  return mapper[genderPreference];
}
