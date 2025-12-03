import { FormState } from '@/types/types';

/**
 * Formats a gender preference value into a
 * display-appropriate string.
 */
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

export function formatOffensePreference(
  offensePreference?: FormState['offensePreference'],
) {
  if (!offensePreference || offensePreference.length === 0) return 'N/A';

  return offensePreference.join(', ');
}

/**
 * Formats a timestamp string or a date object
 * into a American time notation (mm/dd/yyyy)
 */
export function formatAmericanTime(dateParam: Date | string) {
  const date = new Date(dateParam);
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}
