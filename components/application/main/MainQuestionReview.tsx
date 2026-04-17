'use client';

import { useEffect } from 'react';
import { Button } from '@/components/Button';
import QuestionBack from '@/components/questions/QuestionBack';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useAuth } from '@/contexts/AuthProvider';
import { useProfile } from '@/contexts/ProfileProvider';
import { useApplicationNavigation } from '@/hooks/app-process';
import {
  formatAgePreference,
  formatGenderPreference,
  formatOffensePreference,
} from '@/lib/formatters';
import { ApplicationStage } from '@/types/enums';

export default function MainQuestionReview() {
  const { appState } = useApplicationContext();
  const { advanceToStage } = useApplicationNavigation();
  const { userId } = useAuth();
  const { profileData, profileReady, loadProfile } = useProfile();

  useEffect(() => {
    if (userId && !profileReady && !profileData) {
      loadProfile();
    }
  }, [userId, profileReady, profileData, loadProfile]);

  const handleContinue = () => {
    advanceToStage(ApplicationStage.MATCHING);
  };

  return (
    <div className="flex h-[37rem] w-[27rem] flex-col gap-2">
      <div className="flex items-center justify-between">
        <header className="flex flex-col gap-2">
          <h1>Review and Submit</h1>
        </header>
        <div className="flex items-center gap-2"></div>
      </div>

      {/* Scrollable Text Box*/}
      <div className="flex-1 space-y-6 overflow-x-hidden overflow-y-auto">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-8">First Name</p>
            <p className="text-gray-12">
              {profileData?.first_name ?? (profileReady ? '' : 'Loading...')}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-8">Last Name</p>
            <p className="text-gray-12">
              {profileData?.last_name ?? (profileReady ? '' : 'Loading...')}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-8">Date of Birth</p>
            <p className="text-gray-12">
              {profileData?.date_of_birth ?? (profileReady ? '' : 'Loading...')}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-8">
              Preferred Pronouns
            </p>
            <p className="text-gray-12">
              {profileData?.pronouns ?? (profileReady ? '' : 'Loading...')}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-8">Gender</p>
            <p className="text-gray-12">Placeholder</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-8">Personal bio</p>
            <p className="text-gray-12">{appState.form.bio}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-8">
              Gender preference
            </p>
            <p className="text-gray-12">
              {formatGenderPreference(appState.form.genderPreference)}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-8">
              Offenses not preferred
            </p>
            <p className="text-gray-12">
              {formatOffensePreference(appState.form.offensePreference)}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-8">
              Age range preference
            </p>
            <p className="text-gray-12">
              {formatAgePreference(appState.form.agePreference)}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-8">
              {appState.stillInCorrespondence
                ? 'Reason for adopting'
                : 'Why it ended'}
            </p>
            <p className="text-gray-12">
              {(appState.stillInCorrespondence
                ? appState.form.whyAdopting
                : appState.form.whyEnded) || 'N/A'}
            </p>
          </div>
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
