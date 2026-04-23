'use client';

import { useMemo } from 'react';
import {
  LuBell,
  LuClock,
  LuHeart,
  LuInfo,
  LuLayoutDashboard,
} from 'react-icons/lu';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { useProfile } from '@/contexts/ProfileProvider';
import { cn } from '@/lib/utils';
import LogoutButton from './MainDashboard/LogoutButton';

const NAV_LINKS = [
  { href: '/', label: 'Applications', icon: LuLayoutDashboard },
  { href: '/?tab=history', label: 'History', icon: LuClock },
  { href: '#', label: 'Donate', icon: LuHeart },
  { href: '#', label: 'Learn More', icon: LuInfo },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const { profileData } = useProfile();

  const displayName = useMemo(
    () => profileData?.first_name || 'User',
    [profileData?.first_name],
  );

  const isActive = (label: string, href: string) => {
    if (label === 'Dashboard')
      return (
        (pathname === '/' || pathname.startsWith('/app')) && tab !== 'history'
      );
    if (label === 'History') return pathname === '/' && tab === 'history';
    return pathname.startsWith(href);
  };

  return (
    <aside className="sticky top-0 flex h-svh w-72 flex-col border-r border-gray-4 bg-gray-1">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 px-6 py-5">
        <Logo compact />
      </Link>

      {/* Greeting + notification bell */}
      <div className="flex items-center justify-between gap-2 px-6 pb-2">
        <div>
          <p className="text-lg font-bold text-gray-12">Hi {displayName}</p>
          <p className="text-sm text-gray-10">Adopter</p>
        </div>
        <Link
          href="/notifications"
          className="relative rounded p-1.5 text-gray-10 hover:bg-gray-2 hover:text-gray-12"
          aria-label="Notifications"
        >
          <LuBell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-9" />
        </Link>
      </div>

      <div className="border-t border-gray-4" />

      {/* Nav links */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = isActive(label, href);
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-red-2 text-red-12'
                  : 'text-gray-11 hover:bg-gray-2 hover:text-gray-12',
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User profile + logout */}
      <div className="mx-3 border-t border-gray-4 py-4">
        <LogoutButton />
      </div>
    </aside>
  );
}
