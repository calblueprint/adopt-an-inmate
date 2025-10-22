import { QuestionsContextProvider } from '@/contexts/QuestionsContext';
import PreAppQuestionDecider from '../pre/PreAppQuestionDecider';
import ProgressBar from '../ProgressBar';

export default function StagePre() {
  return (
    <div className="flex max-w-120 flex-col gap-6 rounded-lg bg-gray-1 p-8">
      <QuestionsContextProvider numQuestions={2}>
        <ProgressBar />
        <PreAppQuestionDecider />
      </QuestionsContextProvider>
    </div>
  );
}
