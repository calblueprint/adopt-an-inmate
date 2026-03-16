'use client';

import { LuX } from 'react-icons/lu';
import Link from 'next/link';

type Notification = {
  date: string;
  title: string;
  description: string;
  actionLabel?: string;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    date: 'March 2, 2026',
    title: 'You have been approved',
    description:
      'Now that you have been approved, you are officially matched! However, you need to confirm!',
    actionLabel: 'Confirm',
  },
  {
    date: 'February 28, 2026',
    title: 'You have been approved',
    description:
      'Porttitor laoreet penatibus velit facilisi congue tincidunt dictum massa risus hac.',
  },
  {
    date: 'January 9, 2026',
    title: 'You have been waitlisted',
    description:
      'Porttitor laoreet penatibus velit facilisi congue tincidunt dictum massa risus hac.',
  },
  {
    date: 'January 4, 2026',
    title: 'You have been rejected',
    description:
      'Porttitor laoreet penatibus velit facilisi congue tincidunt dictum massa risus hac.',
  },
  {
    date: 'December 3, 2025',
    title: 'Donec',
    description:
      'Porttitor laoreet penatibus velit facilisi congue tincidunt dictum massa risus hac.',
    actionLabel: 'Action Button',
  },
  {
    date: 'September 29, 2025',
    title: 'You have been approved',
    description:
      'Porttitor laoreet penatibus velit facilisi congue tincidunt dictum massa risus hac.',
  },
];

export default function NotificationsPage() {
  return (
    <div className="flex w-full max-w-3xl flex-col rounded-2xl bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-12">Notifications</h1>
        <Link
          href="/"
          className="rounded p-2 text-gray-10 transition-colors hover:bg-gray-2 hover:text-gray-12"
          aria-label="Close notifications"
        >
          <LuX className="h-5 w-5" />
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-gray-4">
        {MOCK_NOTIFICATIONS.map((notif, i) => (
          <div key={i} className="py-5 first:pt-0">
            <p className="mb-2 text-sm font-medium text-gray-10">
              {notif.date}
            </p>
            <p className="mb-1 font-semibold text-gray-12">{notif.title}</p>
            <p className="mb-3 text-sm text-gray-11">{notif.description}</p>
            {notif.actionLabel && (
              <button
                type="button"
                className="rounded-lg bg-gray-12 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-11"
              >
                {notif.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
