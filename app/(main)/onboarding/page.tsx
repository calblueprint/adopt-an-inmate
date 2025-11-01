import Link from 'next/link';
import Logo from '@/components/Logo';
import OnboardingQuestionDOB from '@/components/onboarding/OnboardingQuestionDOB';
import OnboardingQuestionGender from '@/components/onboarding/OnboardingQuestionGender';
import OnboardingQuestionName from '@/components/onboarding/OnboardingQuestionName';
import OnboardingQuestionPronouns from '@/components/onboarding/OnboardingQuestionPronouns';
import OnboardingQuestionState from '@/components/onboarding/OnboardingQuestionState';
import ProgressBar from '@/components/questions/ProgressBar';
import QuestionDecider from '@/components/questions/QuestionDecider';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { QuestionsContextProvider } from '@/contexts/QuestionsContext';

export default function OnboardingPage() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <Link href="/">
        <Logo />
      </Link>

      <div className="flex size-full flex-col items-center justify-center">
        <div className="flex w-9/10 flex-col gap-6 rounded-lg bg-gray-1 p-8 sm:w-[clamp(400px,50%,500px)]">
          <OnboardingProvider>
            <QuestionsContextProvider
              questions={[
                <OnboardingQuestionName key="name" />,
                <OnboardingQuestionDOB key="dob" />,
                <OnboardingQuestionPronouns key="pronouns" />,
                <OnboardingQuestionGender key="gender" />,
                <OnboardingQuestionState key="state" />,
              ]}
            >
              <ProgressBar />
              <QuestionDecider />
            </QuestionsContextProvider>
          </OnboardingProvider>
        </div>
      </div>

      {/* spacer */}
      <div className="h-22" />
    </div>
  );
}
