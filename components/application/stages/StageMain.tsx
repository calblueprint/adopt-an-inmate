import { useState } from 'react';
import QuestionDecider from '@/components/questions/QuestionDecider';
import { QuestionsContextProvider } from '@/contexts/QuestionsContext';
import ProgressBar from '../../questions/ProgressBar';
import MainQuestionBio from '../main/MainQuestionBio';
import MainQuestionGender from '../main/MainQuestionGender';
import MainQuestionOffense from '../main/MainQuestionOffense';
import MainQuestionReason from '../main/MainQuestionReason';
import MainQuestionReview from '../main/MainQuestionReview';

export default function StageMain() {
  const [isReviewPage, setIsReviewPage] = useState(false);

  return (
    <div
      className={`flex w-9/10 flex-col rounded-lg bg-gray-1 p-8 sm:w-[clamp(400px,50%,500px)] ${isReviewPage ? 'mt-4' : ''}`}
    >
      <QuestionsContextProvider
        questions={[
          <MainQuestionBio key="bio" />,
          <MainQuestionGender key="genderPreference" />,
          <MainQuestionOffense key="offensePreference" />,
          <MainQuestionReason key="reason" />,
          <MainQuestionReview key="review" onIsReviewPage={setIsReviewPage} />,
        ]}
      >
        <ProgressBar />
        <QuestionDecider />
      </QuestionsContextProvider>
    </div>
  );
}
