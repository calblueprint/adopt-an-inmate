import ConfirmationDialog from '@/components/home/ConfirmationDialog';
import MainDashboard from '@/components/MainDashboard/MainDashboard';

export default function ApplicationsPage() {
  return (
    <>
      {/* shows up only when search param confirmation=true */}
      <ConfirmationDialog />

      {/* application page */}
      <main className="flex min-h-svh py-7">
        <MainDashboard />
      </main>
    </>
  );
}
