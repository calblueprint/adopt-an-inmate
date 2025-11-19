'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import QuestionBack from '@/components/questions/QuestionBack';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useApplicationNavigation } from '@/hooks/app-process';
import { formatGenderPreference } from '@/lib/formatters';
import { ApplicationStage } from '@/types/enums';

export default function MainQuestionReview() {
  const { appState } = useApplicationContext();
  const { advanceToStage } = useApplicationNavigation();
  const [, setIsLoading] = useState(false);

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('api/embed_and_fetch.py', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: appState.form.bio }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API request failed with status ${response.status}: ${errorText}`,
        );
      }
      const result = await response.json();
      console.log('Generated Embedding:', result.embedding);
      console.log('Similar bios:', result.similar_bios);
      advanceToStage(ApplicationStage.MATCHING);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
