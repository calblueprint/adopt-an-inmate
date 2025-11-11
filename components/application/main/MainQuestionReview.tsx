'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import QuestionBack from '@/components/questions/QuestionBack';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { formatGenderPreference } from '@/lib/formatters';

export default function MainQuestionReview() {
  const { appState, setAppState } = useApplicationContext();
  const router = useRouter();

  const handleContinue = () => {
    setAppState(prev => ({ ...prev, highestStageAchieved: 'main' }));
    router.push('?stage=matches');
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
          <p className="text-sm text-gray-11">
            {appState.stillInCorrespondence
              ? 'Reason for adopting'
              : 'Why it ended'}
          </p>
          <p>
            {appState.stillInCorrespondence
              ? appState.form.whyAdopting
              : appState.form.whyEnded}
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
