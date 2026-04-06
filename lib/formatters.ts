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

export function formatAgePreference(
  agePreference?: FormState['agePreference'],
) {
  if (!agePreference || agePreference.length === 0) return 'N/A';

  // return agePreference;
  return `${agePreference[0]} - ${agePreference[1]}`;
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

/**
 * Formats a timestamp string or a date object
 * into an English date (e.g. Mar 28, 2026)
 */
export function formatDate(dateParam: Date | string) {
  const date = new Date(dateParam);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Capitalize the first letter.
 */
export function capitalize(s: string) {
  return `${s.charAt(0).toUpperCase()}${s.slice(1)}`;
}
