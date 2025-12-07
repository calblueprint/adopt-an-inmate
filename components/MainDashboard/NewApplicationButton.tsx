'use client';

import { useRouter } from 'next/navigation';
import { getNewApplicationId } from '@/actions/applications/newApplication';
import { Button } from '../Button';

export default function NewApplicationButton() {
  const router = useRouter();

  const createApp = async () => {
    const { data, error } = await getNewApplicationId();
    if (error || !data) return;

    // successful; redirect
    router.push(`/app/${data}`);
  };

  return (
    <Button onClick={createApp} variant="tertiary">
      New Application
    </Button>
  );
}
