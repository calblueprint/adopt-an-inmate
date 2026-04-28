import { AdopterApplication } from '@/types/schema';
import { FormState } from '@/types/types';

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
 * Returns an appropriate display text for a relevant
 * date for an application, based on the application's
 * status and various times.
 */
export function formatAppDateByStatus(app: AdopterApplication) {
  switch (app.status) {
    case 'ACTIVE':
      return `Started: ${formatDate(app.time_started || '')}`;
    case 'PENDING':
    case 'REAPPLY':
    case 'REJECTED':
      return `Submitted: ${formatDate(app.time_submitted || '')}`;
    case 'PENDING_CONFIRMATION':
      return `Confirm by: ${formatDate(app.time_confirmation_due || '')}`;
    case 'ENDED':
      return `Ended: ${formatDate(app.time_ended || '')}`;
    case 'INCOMPLETE':
      return `Created: ${formatDate(app.time_created)}`;
    default:
      return '';
  }
}

/**
 * Capitalize the first letter.
 */
export function capitalize(s: string) {
  return `${s.charAt(0).toUpperCase()}${s.slice(1)}`;
}
