'use client';

import { useEffect } from 'react';
import { Button } from '@/components/Button';
import CustomLink from '@/components/CustomLink';
import QuestionBack from '@/components/questions/QuestionBack';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useAuth } from '@/contexts/AuthProvider';
import { useProfile } from '@/contexts/ProfileProvider';
import { useApplicationNavigation } from '@/hooks/app-process';
import {
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
        <div className="flex items-center gap-2">
          <CustomLink
            href="#"
            className="font-semibold text-cyan-11 decoration-solid underline-offset-4"
            onClick={e => {
              e.preventDefault();
            }}
          >
            Edit
          </CustomLink>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M18.1212 6.16023C18.4625 5.81898 18.4625 5.25023 18.1212 4.92648L16.0737 2.87898C15.75 2.53773 15.1812 2.53773 14.84 2.87898L13.23 4.48023L16.5112 7.76148M2.625 15.094V18.3752H5.90625L15.5837 8.68898L12.3025 5.40773L2.625 15.094Z"
              fill="#217574"
            />
          </svg>
        </div>
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
