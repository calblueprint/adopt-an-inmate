import Link from 'next/link';
import Logo from '@/components/Logo';
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
        <QuestionsContextProvider questions={[]}>
          <ProgressBar />
          <QuestionDecider />
        </QuestionsContextProvider>
      </div>

      {/* spacer */}
      <div className="h-22" />
    </div>
  );
}
