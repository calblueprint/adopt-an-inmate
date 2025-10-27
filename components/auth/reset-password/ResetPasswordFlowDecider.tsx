'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ResetPassword from './ResetPassword';
import ResetPasswordError from './ResetPasswordError';
import ResetPasswordSuccess from './ResetPasswordSuccess';

export default function ResetPasswordFlowDecider() {
  const searchParams = useSearchParams();
  const status = useMemo(() => searchParams.get('status'), [searchParams]);

  if (status === 'error') return <ResetPasswordError />;
  if (status === 'success') return <ResetPasswordSuccess />;

  return <ResetPassword />;
}
