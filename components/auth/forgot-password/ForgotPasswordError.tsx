'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ButtonLink } from '@/components/Button';

const defaultMessage =
  'We encountered an unexpected error on our side. If this issue persists, please contact us via email. Sorry for the inconvenience!';

export default function ForgotPasswordError() {
  const searchParams = useSearchParams();
  const error = useMemo(
    () =>
      searchParams.get('error_description')?.replace('+', ' ') ||
      defaultMessage,
    [searchParams],
  );

  return (
    <div className="flex w-106 flex-col gap-2 rounded-2xl bg-gray-1 p-8">
      <p className="text-3xl font-medium">Uh oh.</p>

      <p className="text-gray-11">{error}</p>

      <ButtonLink href="/forgot-password" variant="primary" className="mt-2">
        Try again
      </ButtonLink>
    </div>
  );
}
