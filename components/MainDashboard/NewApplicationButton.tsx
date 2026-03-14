'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createApplication } from '@/actions/applications/createApplication';
import { Button } from '../Button';
import LoadingSpinner from '../LoadingSpinner';

export default function NewApplicationButton() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const createApp = async () => {
    setIsCreating(true);

    const { data: appId, error } = await createApplication();
    if (error || !appId) {
      setIsCreating(false);
      return;
    }

    // successful; redirect to app at correct stage/question
    router.push(`/app/${appId}`);
  };

  return (
    <Button onClick={createApp} variant="tertiary" disabled={isCreating}>
      {isCreating ? (
        <>
          <LoadingSpinner variant="buttonSm" />
          Creating...
        </>
      ) : (
        'New Application'
      )}
    </Button>
  );
}
