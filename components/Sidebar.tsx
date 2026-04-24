'use client';

import { useMemo } from 'react';
import {
  LuClock,
  LuHeart,
  LuInfo,
  LuLayoutDashboard,
  LuUser,
} from 'react-icons/lu';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import LogoutButton from '@/components/MainDashboard/LogoutButton';
import { useProfile } from '@/contexts/ProfileProvider';
import { ButtonLink } from './Button';
import SidebarItem from './SidebarItem';

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
    if (label === 'Applications')
      return (
        (pathname === '/' || pathname.startsWith('/app')) && tab !== 'history'
      );
    if (label === 'History') return pathname === '/' && tab === 'history';
    return pathname.startsWith(href);
  };

  return (
    <aside className="sticky top-0 flex h-svh flex-col items-center gap-8 border-r border-gray-4 bg-gray-1 px-8 pt-13 pb-10">
      {/* Logo */}
      <Link href="/">
        <Logo variant="sidebar" />
      </Link>

      {/* Greeting + notification bell */}
      <section className="flex w-53 flex-col gap-4">
        <p className="text-xl text-black/60">Hi {displayName}!</p>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col gap-0.5">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = isActive(label, href);
            return (
              <SidebarItem
                key={label}
                active={active}
                label={label}
                href={href}
              >
                <Icon className="h-5 w-5 shrink-0" />
              </SidebarItem>
            );
          })}
        </nav>
      </section>

      {/* User profile + logout */}
      <div className="mt-auto flex w-full gap-2">
        <ButtonLink
          variant="outline"
          href="/profile"
          className="min-w-0 flex-1 justify-start px-4!"
        >
          <LuUser className="size-5 text-red-9" />
          <p className="w-full overflow-hidden text-left overflow-ellipsis whitespace-nowrap">
            {displayName}
          </p>
        </ButtonLink>
        <LogoutButton />
      </div>
    </aside>
  );
}
