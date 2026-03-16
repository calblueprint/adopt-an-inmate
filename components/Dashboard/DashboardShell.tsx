'use client';

import Sidebar from './Sidebar';

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-color-bg flex min-h-svh w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto px-8 py-6">{children}</main>
    </div>
  );
}
