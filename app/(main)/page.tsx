'use client';

import CustomLink from '@/components/CustomLink';
import ConfirmationDialog from '@/components/home/ConfirmationDialog';
import LogoutButton from '@/components/LogoutButton';
import StageMainDashboard from '@/components/StageMainDashboard';

export default function ApplicationsPage() {
  return (
    <>
      {/* shows up only when search param confirmation=true */}
      <ConfirmationDialog />

      {/* application page */}
      <main className="flex h-full w-full flex-col items-center pt-7">
        <StageMainDashboard />
      </main>
    </>
  );
}
