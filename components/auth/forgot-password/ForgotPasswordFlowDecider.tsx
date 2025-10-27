'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ForgotPassword from './ForgotPassword';
import ForgotPasswordCheckEmail from './ForgotPasswordCheckEmail';
import ForgotPasswordError from './ForgotPasswordError';
import ForgotPasswordLoading from './ForgotPasswordLoading';

export default function ForgotPasswordFlowDecider() {
  const searchParams = useSearchParams();
  const status = useMemo(() => searchParams.get('status'), [searchParams]);

  if (status === 'check-email') return <ForgotPasswordCheckEmail />;
  if (status === 'loading') return <ForgotPasswordLoading />;
  if (status === 'error') return <ForgotPasswordError />;

  return <ForgotPassword />;
}
