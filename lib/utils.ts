import type { AdopterApplication } from '@/types/schema';
import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { stateNameAbbv } from '@/data/states';

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
  const deployEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;

  // no vercel env => local environment, use localhost
  if (!deployEnv) return 'http://localhost:3000/';

  // preview env => use vercel url for same environment testing
  // otherwise, use prod site url
  const siteUrl =
    deployEnv === 'preview'
      ? process.env.NEXT_PUBLIC_VERCEL_URL
      : process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;

  return `https://${siteUrl}/`;
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
 * Safely gets an environment variable. If it doesn't exist, throw an error.
 */
export const getEnvVar = (key: string) => {
  assertEnvVarExists(key);
  return process.env[key] as string;
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

/**
 * Get the stage and question to resume/view an application.
 * For incomplete: route to correct stage/question based on filled columns.
 * For pending/accepted/rejected/ended: route to SUBMITTED stage (show info).
 * - ranked_cards not null (incomplete) -> MATCHING stage (2), q=0
 * - ranked_cards null: check main question columns for MAIN stage question
 *   - personal_bio -> q0, gender_pref -> q1, offense_pref -> q2, return_explanation -> q3
 *   - all main cols filled -> q4 (review)
 * - No main cols filled -> PRE stage (0), q=0
 */
export function getResumeStageAndQuestion(app: AdopterApplication): {
  stage: number;
  question: number;
} {
  // Non-incomplete: show submitted/info view
  if (app.status !== 'incomplete') {
    return { stage: 3, question: 0 }; // SUBMITTED
  }

  // ranked_cards not null -> MATCHING stage (2)
  if (app.ranked_cards != null) {
    return { stage: 2, question: 0 };
  }

  // Check MAIN stage question columns
  const hasBio = app.personal_bio != null && app.personal_bio.trim() !== '';
  const hasGender = app.gender_pref != null && app.gender_pref.trim() !== '';
  const hasOffense = app.offense_pref != null && app.offense_pref.length > 0;
  const hasReason =
    app.return_explanation != null && app.return_explanation.trim() !== '';

  if (hasBio) {
    //TODO: update routing & other logic to remove offense, reason + add age
    if (!hasGender) return { stage: 1, question: 1 };
    if (!hasOffense) return { stage: 1, question: 2 };
    if (!hasReason) return { stage: 1, question: 3 };
    return { stage: 1, question: 4 }; // review
  }

  // PRE stage - no main cols filled
  return { stage: 0, question: 0 };
}
