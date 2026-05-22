'use client';

import { useCurrentQuestionElement } from '@/hooks/questions';

export default function QuestionDecider() {
  const question = useCurrentQuestionElement();

  return <>{question}</>;
}
