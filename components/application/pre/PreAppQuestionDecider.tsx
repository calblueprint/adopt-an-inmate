'use client';

import { notFound } from 'next/navigation';
import { useCurrentQuestionInt } from '@/hooks/useCurrentQuestion';
import QuestionIncarcerated from './QuestionIncarcerated';
import QuestionSeekingRomance from './QuestionSeekingRomance';

export default function PreAppQuestionDecider() {
  const currentQuestionInt = useCurrentQuestionInt();

  if (currentQuestionInt === 0) return <QuestionSeekingRomance />;
  if (currentQuestionInt === 1) return <QuestionIncarcerated />;

  throw notFound();
}
