// @vitest-environment jsdom

import { expect, test, vi } from 'vitest';
import { loadEnvironment } from '@/lib/test-utils';

vi.stubEnv('NODE_ENV', 'production');
loadEnvironment();

// run tests
test('environment is browser', () => {
  expect(typeof window === 'undefined').toBeFalsy();
});

test('environment variables are set', () => {
  expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
  expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();

  /**
   * Other environment variables are still technically
   * visible. This is because Next.js actually does not
   * export the env file, but rather replaces every use
   * of NEXT_PUBLIC_* environment variables with the value
   * itself. This test simply loads the env file, which operates
   * differently.
   *
   * Nonetheless, we shouldn't have to worry about exposed
   * environment variables to the client as long as the
   * secrets are not prefixed by NEXT_PUBLIC.
   */
});
