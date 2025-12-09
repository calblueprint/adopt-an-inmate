import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { stateNameAbbv } from '@/data/states';
import { AdopterApplication } from '@/types/schema';

/**
 * Random number generator built on top of Math.random().
 *
 * @param min The minimum value (inclusive)
 * @param max The maximum value (inclusive)
 * @returns A random number between min and max.
 */
export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Conditional merge of class values.
 *
 * ```ts
 * cn('flex', true && 'p-10', false && 'm-8')
 *   => 'flex p-10'
 *
 * cn({ 'flex': true, 'p-10': false })
 *   => 'flex'
 *
 * cn(['flex', 'p-10'])
 *   => 'flex p-10'
 * ```
 *
 * @param inputs The class values to merge
 * @returns A single class name evaluated from the class values.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the site URL depending on environment.
 */
export const getSiteUrl = () => {
  // environment variables set by Vercel when deployed
  // if they don't exist, assume local testing environment
  let url =
    process?.env?.NEXT_PUBLIC_PRODUCTION_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000/';

  // prepend with https if it's not localhost
  url = url.startsWith('http') ? url : `https://${url}`;

  // ensure trailing /
  url = url.endsWith('/') ? url : `${url}/`;

  return url;
};

/**
 * Async function to wait for a set number of milliseconds.
 */
export const sleep = async (ms: number) => {
  await new Promise(resolve => setTimeout(() => resolve(0), ms));
};

/**
 * Asserts that an environment variable exists.
 */
export const assertEnvVarExists = (key: string) => {
  if (!process.env[key]) throw new Error(`Could not find ${key}, is it set?`);
};

/**
 * Get the abbreviation of a state from its name.
 * ex: getStateAbbv("California") => "CA"
 */
export const getStateAbbv = (state: string) => {
  const loweredState = state.toLowerCase();
  return stateNameAbbv[loweredState] ?? 'N/A';
};

/**
 * Calculates the age from a date of birth.
 */
export const calculateAge = (dob: Date | string): number => {
  const birthdate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDifference = today.getMonth() - birthdate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthdate.getDate())
  ) {
    age--;
  }

  return age;
};

/**
 * Determine if an application is active.
 *
 * Returns true if the application is
 * active, false otherwise.
 */
export const appIsActive = (app: AdopterApplication) => {
  return !(app.status === 'rejected' || app.status === 'ended');
};
