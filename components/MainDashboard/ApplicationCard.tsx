import { formatAmericanTime } from '@/lib/formatters';
import { determineAppStatus } from '@/lib/utils';
import { AdopterApplication } from '@/types/schema';
import ApplicationCardButton from './ApplicationCardButton';

export default function ApplicationCard({ app }: { app: AdopterApplication }) {
  return (
    <div className="flex w-55 flex-col rounded-2xl border-2 border-cyan-12 bg-white">
      <div className="flex flex-col gap-y-30">
        <div className="flex flex-row justify-end pt-3 pr-3">
          <ApplicationCardButton />
        </div>

        <div className="flex flex-col pb-3 pl-3">
          <p className="font-medium text-red-12">
            {formatAmericanTime(app.time_submitted)}
          </p>
          <p className="text-xs text-gray-10">
            Status: {determineAppStatus(app)}
          </p>
        </div>
      </div>
    </div>
  );
}
