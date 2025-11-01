import QuestionDecider from '@/components/questions/QuestionDecider';
import { QuestionsContextProvider } from '@/contexts/QuestionsContext';
import ProgressBar from '../../questions/ProgressBar';
import QuestionIncarcerated from '../pre/QuestionIncarcerated';
import QuestionSeekingRomance from '../pre/QuestionSeekingRomance';
import QuestionSuccess from '../pre/QuestionSuccess';

export default function StagePre() {
  return (
    <div className="flex max-w-120 flex-col gap-6 rounded-lg bg-gray-1 p-8">
      <QuestionsContextProvider
        questions={[
          <QuestionSeekingRomance key="seekingRomance" />,
          <QuestionIncarcerated key="incarcerated" />,
          <QuestionSuccess key="success" />,
        ]}
      >
        <ProgressBar />
        <QuestionDecider />
      </QuestionsContextProvider>
    </div>
  );
}
