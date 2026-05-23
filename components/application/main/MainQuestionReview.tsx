'use client';

import { useEffect, useState } from 'react';
import { verifyApplication } from '@/actions/applications/verifyApplication';
import { Button } from '@/components/Button';
import QuestionBack from '@/components/questions/QuestionBack';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useAuth } from '@/contexts/AuthProvider';
import { useProfile } from '@/contexts/ProfileProvider';
import { useAppProcess } from '@/hooks/app-process';
import { formatAgePreference, formatGenderPreference } from '@/lib/formatters';
import { ApplicationStage } from '@/types/enums';

export default function MainQuestionReview() {
  const { appState } = useApplicationContext();
  const { advanceToStage } = useAppProcess();
  const { userId } = useAuth();
  const { profileData, profileReady, loadProfile } = useProfile();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (userId && !profileReady && !profileData) {
      loadProfile();
    }
  }, [userId, profileReady, profileData, loadProfile]);

  const handleContinue = async () => {
    // verify app
    const { data, error } = await verifyApplication(appState.appId);

    if (error) {
      setErrorMsg(error);
      return;
    }

    if (!data?.verified) {
      setErrorMsg('Some fields are invalid.');
      return;
    }

    advanceToStage(ApplicationStage.MATCHING);
  };

  return (
    <div className="flex h-[37rem] w-[27rem] flex-col gap-4">
      <div className="flex flex-col justify-between">
        <header className="flex flex-col gap-2">
          <h1>Review and Submit</h1>
        </header>
        <div className="flex items-center gap-2">
          <p className="text-red-9">{errorMsg ? `Error: ${errorMsg}` : ''}</p>
        </div>
      </div>

      {/* Scrollable Text Box*/}
      <div className="flex-1 space-y-6 overflow-x-hidden overflow-y-auto px-1 pr-2 break-words">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-8">First Name</p>
            <p className="text-gray-12">
              {profileData?.first_name ?? (profileReady ? 'N/A' : 'Loading...')}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-8">Last Name</p>
            <p className="text-gray-12">
              {profileData?.last_name ?? (profileReady ? 'N/A' : 'Loading...')}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-8">Date of Birth</p>
            <p className="text-gray-12">
              {profileData?.date_of_birth ??
                (profileReady ? 'N/A' : 'Loading...')}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-8">
              Preferred Pronouns
            </p>
            <p className="text-gray-12">
              {profileData?.pronouns ?? (profileReady ? 'N/A' : 'Loading...')}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-8">Personal bio</p>
            <p className="text-gray-12">{appState.form.bio ?? 'N/A'}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-8">
              Gender preference
            </p>
            <p className="text-gray-12">
              {formatGenderPreference(appState.form.genderPreference ?? 'N/A')}
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
