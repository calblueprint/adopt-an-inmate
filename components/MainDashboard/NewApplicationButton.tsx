'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getNewApplicationId } from '@/actions/applications/newApplication';
import { Button } from '../Button';
import LoadingSpinner from '../LoadingSpinner';

export default function NewApplicationButton() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const createApp = async () => {
    setIsCreating(true);

    const { data, error } = await getNewApplicationId();
    if (error || !data) {
      setIsCreating(false);
      return;
    }

    // successful; redirect to app at correct stage/question
    router.push(`/app/${data.app_uuid}?stage=${data.stage}&q=${data.question}`);
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
