'use client';

import {
  useCurrentQuestionElement,
  useSequenceSkipBlocker,
} from '@/hooks/questions';

export default function QuestionDecider() {
  useSequenceSkipBlocker();

  const Question = useCurrentQuestionElement();

  return <Question />;
}
