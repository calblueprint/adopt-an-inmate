'use client';

import { useEffect } from 'react';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { useCurrentQuestion } from '@/hooks/useCurrentQuestion';
import QuestionIncarcerated from './QuestionIncarcerated';
import QuestionSeekingRomance from './QuestionSeekingRomance';
import QuestionSuccess from './QuestionSuccess';

export default function PreAppQuestionDecider() {
  const { questionsCompleted } = useQuestionsContext();
  const currentQuestion = useCurrentQuestion();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // correct any URL brute force injection
    if (questionsCompleted < currentQuestion) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('q', questionsCompleted.toString());
      router.replace(`?${params.toString()}`);
    }
  }, [questionsCompleted, currentQuestion, router, searchParams]);

  if (currentQuestion === 0) return <QuestionSeekingRomance />;
  if (currentQuestion === 1) return <QuestionIncarcerated />;
  if (currentQuestion === 2) return <QuestionSuccess />;

  throw notFound();
}
