import { capitalize, formatAmericanTime } from '@/lib/formatters';
import { AdopterApplication } from '@/types/schema';
import ApplicationCardButton from './ApplicationCardButton';

interface ApplicationCardProps {
  app: AdopterApplication;
  displayName?: string;
}

export default function ApplicationCard({
  app,
  displayName = 'Application',
}: ApplicationCardProps) {
  return (
    <div className="flex h-55 w-55 flex-col justify-between rounded-2xl border-2 border-cyan-12 bg-white">
      <div className="flex flex-row justify-end pt-3 pr-3">
        <ApplicationCardButton app={app} />
      </div>
      <div className="flex flex-col gap-1 pb-3 pl-3">
        <p className="text-sm font-semibold text-gray-12">{displayName}</p>
        <p className="font-medium text-red-12">
          {app.time_submitted
            ? `Submitted: ${formatAmericanTime(app.time_submitted)}`
            : `Created: ${formatAmericanTime(app.time_created)}`}
        </p>
        <p className="text-xs text-gray-10">Status: {capitalize(app.status)}</p>
      </div>
    </div>
  );
}
