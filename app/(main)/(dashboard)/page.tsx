import ApplicationPreviewDialog from '@/components/home/application-preview/ApplicationPreviewDialog';
import ConfirmationDialog from '@/components/home/ConfirmationDialog';
import MainDashboard from '@/components/MainDashboard/MainDashboard';

export default function DashboardPage() {
  return (
    <>
      {/* conditionally rendered dialogs */}
      <ConfirmationDialog />
      <ApplicationPreviewDialog />

      {/* page */}
      <MainDashboard />
    </>
  );
}
