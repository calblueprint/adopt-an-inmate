'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import SignUpCheckEmail from '@/components/auth/sign-up/SignUpCheckEmail';
import SignUpForm from '@/components/auth/sign-up/SignUpForm';

export default function SignUpPage() {
  const searchParam = useSearchParams();
  const tab = useMemo(() => searchParam.get('tab'), [searchParam]);

  if (tab === 'check-email')
    return (
      <div className="flex size-full flex-col items-center justify-center">
        <SignUpCheckEmail />
      </div>
    );

  return <SignUpForm />;
}
