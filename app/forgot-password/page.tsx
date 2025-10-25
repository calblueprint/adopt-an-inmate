'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import CheckEmail from '@/components/auth/forgot-password/CheckEmail';
import ForgotPassword from '@/components/auth/forgot-password/ForgotPassword';
import Logo from '@/components/Logo';

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const status = useMemo(() => searchParams.get('status'), [searchParams]);

  return (
    <div className="flex size-full flex-col items-center gap-4">
      <Logo />

      <div className="flex size-full flex-col items-center justify-center">
        {status === 'check-email' ? <CheckEmail /> : <ForgotPassword />}
      </div>

      {/* spacer */}
      <div className="h-22" />
    </div>
  );
}
