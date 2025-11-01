'use client';

import { useQuestionNavigaton } from '@/hooks/questions';
import { Button } from '../Button';

export default function QuestionBack() {
  const { prevQuestion } = useQuestionNavigaton();

  const handleBack = () => {
    prevQuestion();
  };

  return (
    <Button type="button" variant="secondary" onClick={handleBack}>
      Back
    </Button>
  );
}
