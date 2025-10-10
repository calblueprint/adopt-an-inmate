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

export async function serverLog(message: string) {
  console.log(message);
}

export async function serverWarn(message: string) {
  console.warn(message);
}

export async function serverError(message: string) {
  console.error(message);
}

export async function serverInfo(message: string) {
  console.info(message);
}
