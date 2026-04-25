import { AdopterApplication } from '@/types/schema';
import { FormState } from '@/types/types';

/**
 * Format an application's ended message
 */
export function formatEndedMessage(
  timeEnded: string | null,
  endedReason: string | null,
) {
  if (!(timeEnded || endedReason))
    return 'Application ended without reason or time.';

  const timeString = timeEnded ? ` on ${formatDate(timeEnded)}` : '';
  const reason = endedReason ? ` because "${endedReason}"` : '';

  return 'Ended' + timeString + reason;
}

/**
 * Formats an application status value into a
 * display-appropriate string.
 */
export function formatAppStatus(status: AdopterApplication['status']) {
  // custom mapping
  if (status === 'ACTIVE') return 'Active';
  if (status === 'PENDING_CONFIRMATION') return 'Pending';

  // generic
  return capitalize(status.toLowerCase().replaceAll('_', ' '));
}

/**
 * Formats a gender preference value into a
 * display-appropriate string.
 */
export function formatGenderPreference(genderPreference?: string | null) {
  if (!genderPreference) return 'N/A';

  if (genderPreference === 'no_preference') return 'No preference';

  return capitalize(genderPreference);
}

/**
 * Formats an age preference range into a
 * display-appropriate string.
 */
export function formatAgePreference(
  agePreference?: FormState['agePreference'],
) {
  if (!agePreference || agePreference.length === 0) return 'N/A';
  if (agePreference.length > 2) return 'Error';
  if (agePreference.length === 1) return agePreference[0];

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
