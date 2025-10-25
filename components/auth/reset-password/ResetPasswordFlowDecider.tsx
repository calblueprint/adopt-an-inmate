'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ResetPassword from './ResetPassword';
import ResetPasswordFailure from './ResetPasswordFailure';
import ResetPasswordLoading from './ResetPasswordLoading';
import ResetPasswordSuccess from './ResetPasswordSuccess';

export default function ResetPasswordFlowDecider() {
  const searchParams = useSearchParams();
  const status = useMemo(() => searchParams.get('status'), [searchParams]);

  if (status === 'resetting') return <ResetPassword />;
  if (status === 'error') return <ResetPasswordFailure />;
  if (status === 'success') return <ResetPasswordSuccess />;

  return <ResetPasswordLoading />;
}
