'use client';

import {
  useCurrentQuestionElement,
  useSequenceSkipBlocker,
} from '@/hooks/questions';

export default function QuestionDecider() {
  useSequenceSkipBlocker();

  const question = useCurrentQuestionElement();

  return <>{question}</>;
}
