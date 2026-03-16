import MainDashboardTabs from './MainDashboardTabs';

export default function MainDashboard() {
  return (
    <div className="flex w-full max-w-4xl flex-col gap-6 rounded-2xl bg-white p-8">
      <MainDashboardTabs />
    </div>
  );
}
