'use client';

import { useMemo } from 'react';
import { LuArrowUpRight } from 'react-icons/lu';
import Link from 'next/link';
import { cva } from 'class-variance-authority';
import { CONFIG } from '@/config';
import { formatDate } from '@/lib/formatters';
import { AdopterApplication } from '@/types/schema';

const calloutStyles = cva(
  'rounded-lg px-6 py-5 flex flex-col gap-1 font-medium',
  {
    variants: {
      status: {
        PENDING: 'bg-yellow-3',
        PENDING_CONFIRMATION: 'bg-yellow-3',
        ACTIVE: 'bg-[#DEF4DF]',
        ACCEPTED: 'bg-[#DEF4DF]',
        REAPPLY: 'bg-[#EBD2FF]',
        REJECTED: 'bg-red-5',
        ENDED: 'bg-[#FDDEF3]',
        INCOMPLETE: '',
      },
      variant: {
        default: '',
        link: 'flex-row items-center justify-between gap-2 group',
      },
    },
  },
);

export default function AppCallout({
  app,
  children,
}: {
  app: AdopterApplication;
  children?: React.ReactNode;
}) {
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
        return app.time_confirmation_due
          ? `You have until ${formatDate(app.time_confirmation_due)} to respond.`
          : 'You have two weeks to respond.';
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

  if (app.status === 'ACTIVE')
    return (
      <CalloutLink
        href="https://docs.google.com/document/d/1ASL6ReAo3zyODDdqjf9bP3OWAWlZQG8bplheDCYFMRM/edit?usp=sharing"
        status={app.status}
      >
        Click here to see mailing regulation by state
      </CalloutLink>
    );

  return (
    <div className={calloutStyles({ status: app.status })}>
      <p className="text-md">{calloutTitle}</p>
      <p className="text-sm text-black/40">{calloutDescription}</p>

      {children}
    </div>
  );
}

function CalloutLink({
  href,
  children,
  status,
}: {
  href: string;
  children?: React.ReactNode;
  status: AdopterApplication['status'];
}) {
  return (
    <Link
      href={href}
      className={calloutStyles({ status, variant: 'link' })}
      target="_blank"
    >
      {children}
      <LuArrowUpRight className="text-gray-11 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-125" />
    </Link>
  );
}
