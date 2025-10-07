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
});
