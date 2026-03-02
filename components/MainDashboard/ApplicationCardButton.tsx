'use client';

import type { AdopterApplication } from '@/types/schema';
import { useRouter } from 'next/navigation';
import { getResumeStageAndQuestion } from '@/lib/utils';

export default function ApplicationCardButton({
  app,
}: {
  app: AdopterApplication;
}) {
  const router = useRouter();

  const handleClick = () => {
    const { stage, question } = getResumeStageAndQuestion(app);
    router.push(`/app/${app.app_uuid}?stage=${stage}&q=${question}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="cursor-pointer rounded-sm bg-gray-2 px-2 pt-1 pb-2 text-black"
    >
      <p>...</p>
    </button>
  );
}
