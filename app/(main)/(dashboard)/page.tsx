import ApplicationPreviewDialog from '@/components/home/ApplicationPreviewDialog';
import ConfirmationDialog from '@/components/home/ConfirmationDialog';
import MainDashboard from '@/components/MainDashboard/MainDashboard';

export default function DashboardPage() {
  return (
    <>
      <ConfirmationDialog />

      <ApplicationPreviewDialog />

      {/* application page */}
      <main className="flex min-h-svh py-7">
        <MainDashboard />
      </main>
    </>
  );
}
