import LogoutButton from './LogoutButton';
import MainDashboardTabs from './MainDashboardTabs';
import NewApplicationButton from './NewApplicationButton';

export default function MainDashboard() {
  return (
    <div className="mx-auto flex w-full max-w-400 flex-row justify-end gap-7 px-7">
      <div className="min-w-61">
        <LogoutButton />
      </div>

      <div className="flex w-full flex-col gap-14 rounded-2xl bg-white p-16">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <p className="text-2xl font-semibold text-cyan-12">Applications</p>
            <p className="text-gray-13">
              Welcome to your application dashboard
            </p>
          </div>

          <div>
            <NewApplicationButton />
          </div>
        </div>

        <MainDashboardTabs />
      </div>
    </div>
  );
}
