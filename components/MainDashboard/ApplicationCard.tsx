'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { capitalize, formatAmericanTime } from '@/lib/formatters';
import { getResumeStageAndQuestion } from '@/lib/utils';
import { AdopterApplication } from '@/types/schema';
import ApplicationCardButton from './ApplicationCardButton';

export default function ApplicationCard({ app }: { app: AdopterApplication }) {
  const appLink = useMemo(() => {
    if (app.status === 'INCOMPLETE') {
      const { question, stage } = getResumeStageAndQuestion(app);
      return `/app/${app.app_uuid}?stage=${stage}&q=${question}`;
    } else {
      return `/?dialog=preview&preview=${app.app_uuid}`;
    }
  }, [app]);

  return (
    <Link
      href={appLink}
      className="flex h-60 w-96 flex-col rounded-2xl border-2 border-cyan-12 bg-white"
    >
      <div className="flex flex-col gap-y-30">
        <div className="flex flex-row justify-end pt-3 pr-3">
          <ApplicationCardButton app={app} />
        </div>

        <div className="flex flex-col pb-3 pl-3">
          <p className="font-medium text-red-12">
          {app.time_submitted
            ? `Submitted: ${formatAmericanTime(app.time_submitted)}`
            : `Created: ${formatAmericanTime(app.time_created)}`}
        </p>
        <p className="text-xs text-gray-10">Status: {capitalize(app.status)}</p>
        </div>
      </div>
    </Link>
  );
}