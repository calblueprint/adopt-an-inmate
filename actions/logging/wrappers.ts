'use server';

/**
 * This file defines server actions for logging.
 * The output of these logs will be shown only to
 * the server console, with the possibility of extending
 * to external logging services in the future.
 *
 * This wrapping is necessary because server actions must be
 * defined as async free functions (i.e. not class methods).
 * However, the functions defined here are used directly by
 * the Logger class, accessible to both server-side and
 * client-side code.
 */

export async function serverLog(
  message?: unknown,
  ...optionalParams: unknown[]
) {
  console.log(message, ...optionalParams);
}

export async function serverWarn(
  message?: unknown,
  ...optionalParams: unknown[]
) {
  console.warn(message, ...optionalParams);
}

export async function serverError(
  message?: unknown,
  ...optionalParams: unknown[]
) {
  console.error(message, ...optionalParams);
}
