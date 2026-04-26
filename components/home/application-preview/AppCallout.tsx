'use client';

import { useMemo } from 'react';
import { cva } from 'class-variance-authority';
import { CONFIG } from '@/config';
import { AdopterApplication } from '@/types/schema';

const calloutStyles = cva('rounded-lg px-6 py-5 flex flex-col gap-1', {
  variants: {
    variant: {
      PENDING: 'bg-yellow-2',
      PENDING_CONFIRMATION: 'bg-yellow-2',
      ACTIVE: 'bg-[#DEF4DF]',
      ACCEPTED: 'bg-[#DEF4DF]',
      REAPPLY: 'bg-[#EBD2FF]',
      REJECTED: 'bg-red-5',
      ENDED: 'bg-[#FDDEF3]',
      INCOMPLETE: '',
    },
  },
});

export default function AppCallout({ app }: { app: AdopterApplication }) {
  const calloutTitle = useMemo(() => {
    if (!app) return '';

    switch (app.status) {
      case 'REAPPLY':
        return 'Please reapply!';
      case 'ENDED':
        return 'Your application has ended.';
      case 'REJECTED':
        return `Email ${CONFIG.adminEmail}`;
      case 'PENDING':
        return 'The NPO is reviewing your application.';
      case 'PENDING_CONFIRMATION':
        return `You have been matched with ${app.adoptee_name}.`;
      default:
        return '';
    }
  }, [app]);

  const calloutDescription = useMemo(() => {
    if (!app) return '';

    switch (app.status) {
      case 'PENDING':
        return 'It will take about 5-7 days. Check your email to be updated!';
      case 'PENDING_CONFIRMATION':
        return 'Do you confirm that you will communicate with your adoptee? You have 2 weeks to respond.';
      case 'REAPPLY':
        return app.matched_adoptee
          ? "We didn't hear from you within 2 weeks."
          : 'There was an issue with your application.';
      case 'ENDED':
        return `Reason: ${app.ended_reason || 'N/A'}`;
      case 'REJECTED':
        return 'for appeals or reasoning, and to submit further applications.';
      default:
        return '';
    }
  }, [app]);

  return (
    <div className={calloutStyles({ variant: app.status })}>
      <p className="text-md font-medium">{calloutTitle}</p>
      <p className="text-sm font-medium text-black/40">{calloutDescription}</p>
    </div>
  );
}
