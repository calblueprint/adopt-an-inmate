'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { appIsActive } from '@/lib/utils';
import { AdopterApplication } from '@/types/schema';
import { ButtonLink } from './Button';
import SidebarItem from './SidebarItem';

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const { profileData } = useProfile();

  // counts for Applications and History
  const [activeCount, setActiveCount] = useState<number>(0);
  const [historyCount, setHistoryCount] = useState<number>(0);

  // fetch application counts
  useEffect(() => {
    const fetchCounts = async () => {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: apps } = await supabase
        .from('adopter_applications_dummy')
        .select('*')
        .eq('adopter_uuid', user.id);

      if (!apps) return;

      setActiveCount(
        apps.filter((app: AdopterApplication) => appIsActive(app)).length,
      );
      setHistoryCount(
        apps.filter((app: AdopterApplication) => !appIsActive(app)).length,
      );
    };

    fetchCounts();
  }, []);

  const NAV_LINKS = [
    {
      href: '/',
      label: `Applications (${activeCount})`,
      icon: LuLayoutDashboard,
      external: false,
    },
    {
      href: '/?tab=history',
      label: `History (${historyCount})`,
      icon: LuClock,
      external: false,
    },
    {
      href: 'https://givebutter.com/zuB5RG',
      label: 'Donate',
      icon: LuHeart,
      external: true,
    },
    {
      href: 'https://adoptaninmate.org/adopting/',
      label: 'Learn More',
      icon: LuInfo,
      external: true,
    },
  ] as const;

  const displayName = useMemo(
    () => profileData?.first_name || 'User',
    [profileData?.first_name],
  );

  // isActive checks for startsWith on Applications/History labels with counts
  const isActive = (label: string, href: string) => {
    if (label.startsWith('Applications'))
      return (
        (pathname === '/' || pathname.startsWith('/app')) && tab !== 'history'
      );
    if (label.startsWith('History'))
      return pathname === '/' && tab === 'history';
    return pathname.startsWith(href);
  };

  return (
    <aside className="sticky top-0 flex h-svh flex-col items-center gap-8 border-r border-gray-4 bg-gray-1 px-8 pt-13 pb-10">
      {/* Logo */}
      <Link href="/">
        <Logo variant="sidebar" />
      </Link>

      {/* Greeting */}
      <section className="flex w-56 flex-col gap-4">
        <p className="text-xl text-black/60">Hi {displayName}!</p>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col gap-0.5">
          {NAV_LINKS.map(({ href, label, icon: Icon, external }) => {
            const active = isActive(label, href);
            return (
              <SidebarItem
                key={label}
                active={active}
                label={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
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
