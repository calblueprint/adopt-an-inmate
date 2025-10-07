// @vitest-environment node

import { expect, test, vi } from 'vitest';
import { loadEnvironment } from '@/lib/test-utils';

vi.stubEnv('NODE_ENV', 'production');
loadEnvironment();

// run tests
test('environment is server', () => {
  expect(typeof window === 'undefined').toBeTruthy();
});

test('environment variables are set', () => {
  expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
  expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
  expect(process.env.TESTING_EMAIL_ADDRESS).toBeDefined();
  expect(process.env.TESTING_EMAIL_PASSWORD).toBeDefined();
  expect(process.env.TESTING_EMAIL_APP_PASSWORD).toBeDefined();
  expect(process.env.TESTING_EMAIL_RECIPIENT).toBeDefined();
});
