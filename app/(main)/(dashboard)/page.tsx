import ConfirmationDialog from '@/components/home/ConfirmationDialog';
import MainDashboard from '@/components/MainDashboard/MainDashboard';

export default function DashboardPage() {
  return (
    <>
      <ConfirmationDialog />
      <main className="flex min-h-svh py-7">
        <MainDashboard />
      </main>
    </>
  );
}
