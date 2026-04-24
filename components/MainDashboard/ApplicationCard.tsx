'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/formatters';
import { getResumeStageAndQuestion } from '@/lib/utils';
import { AdopterApplication } from '@/types/schema';
import { Button } from '../Button';
import StatusPill from '../home/application-preview/StatusPill';

export default function ApplicationCard({ app }: { app: AdopterApplication }) {
  const appLink = useMemo(() => {
    if (app.status === 'INCOMPLETE') {
      const { question, stage } = getResumeStageAndQuestion(app);
      return `/app/${app.app_uuid}?stage=${stage}&q=${question}`;
    } else {
      return `/?dialog=preview&preview=${app.app_uuid}`;
    }
  }, [app]);

  const appStatusText = useMemo(() => {
    switch (app.status) {
      case 'ACTIVE':
        return 'Matched';
      case 'PENDING':
        return 'Review in Progress';
      case 'PENDING_CONFIRMATION':
        return 'Match Ready';
      case 'REJECTED':
        return 'Application Unsuccessful';
      case 'ENDED':
        return 'No Longer Active';
      case 'REAPPLY':
        return 'Eligible to Reapply';
      case 'INCOMPLETE':
        const { question } = getResumeStageAndQuestion(app);
        return `Step ${question + 1} of 5`;
      default:
        return '';
    }
  }, [app]);

  return (
    <Link
      href={appLink}
      className="flex h-60 w-full min-w-96 flex-col items-baseline gap-6 rounded-lg border-2 border-gray-4 bg-white p-8"
    >
      <StatusPill status={app.status} />
      <div className="flex flex-col gap-4">
        <h2>
          {app.status === 'ACTIVE' || app.status === 'ENDED'
            ? app.adoptee_name
            : `Application #${app.app_num}`}
        </h2>
        <p className="text-gray-10">
          {app.time_submitted
            ? `Submitted: ${formatDate(app.time_submitted)}`
            : `Started: ${formatDate(app.time_created)}`}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="primary">
          {app.status === 'INCOMPLETE' ? 'Continue' : 'View'}
        </Button>
        <p
          className={
            app.status === 'PENDING' || app.status === 'PENDING_CONFIRMATION'
              ? 'text-red-9'
              : 'text-gray-9'
          }
        >
          {appStatusText}
        </p>
      </div>
    </Link>
  );
}
