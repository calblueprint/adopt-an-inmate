'use client';

import { Button } from '@/components/Button';
import QuestionBack from '@/components/questions/QuestionBack';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useApplicationNavigation } from '@/hooks/app-process';
import {
  formatGenderPreference,
  formatOffensePreference,
} from '@/lib/formatters';
import { ApplicationStage } from '@/types/enums';

export default function MainQuestionReview() {
  const { appState } = useApplicationContext();
  const { advanceToStage } = useApplicationNavigation();

  const handleContinue = () => {
    advanceToStage(ApplicationStage.MATCHING);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2">
        <h1>Does this look right?</h1>
      </header>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-11">Personal bio</p>
          <p>{appState.form.bio}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-11">Gender preference</p>
          <p>{formatGenderPreference(appState.form.genderPreference)}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-11">Offenses not preffered</p>
          <p>{formatOffensePreference(appState.form.offensePreference)}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-11">
            {appState.stillInCorrespondence
              ? 'Reason for adopting'
              : 'Why it ended'}
          </p>
          <p>
            {(appState.stillInCorrespondence
              ? appState.form.whyAdopting
              : appState.form.whyEnded) || 'N/A'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <QuestionBack />
        <Button variant="primary" type="button" onClick={handleContinue}>
          Looks good
        </Button>
      </div>
    </div>
  );
}
