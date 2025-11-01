import Link from 'next/link';
import Logo from '@/components/Logo';
import OnboardingQuestionName from '@/components/onboarding/OnboardingQuestionName';
import ProgressBar from '@/components/questions/ProgressBar';
import QuestionDecider from '@/components/questions/QuestionDecider';
import { QuestionsContextProvider } from '@/contexts/QuestionsContext';

export default function OnboardingPage() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <Link href="/">
        <Logo />
      </Link>

      <div className="flex size-full flex-col items-center justify-center">
        <div className="flex max-w-120 flex-col gap-6 rounded-lg bg-gray-1 p-8">
          <QuestionsContextProvider
            questions={[<OnboardingQuestionName key="name" />]}
          >
            <ProgressBar />
            <QuestionDecider />
          </QuestionsContextProvider>
        </div>
      </div>

      {/* spacer */}
      <div className="h-22" />
    </div>
  );
}
