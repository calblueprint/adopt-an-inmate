'use client';

import { useForm } from 'react-hook-form';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { useQuestionAdvancer } from '@/hooks/questions';
import { Button } from '../Button';
import { Textbox } from '../Textbox';

interface PronounsForm {
  dob: Date;
}

export default function OnboardingQuestionDOB() {
  const { register, handleSubmit } = useForm<PronounsForm>();
  const { setOnboardingInfo } = useOnboardingContext();
  const { advanceToQuestion } = useQuestionAdvancer();

  const onSubmit = ({ dob }: PronounsForm) => {
    setOnboardingInfo(prev => ({ ...prev, dob }));
    advanceToQuestion(2);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <header className="flex flex-col gap-2">
        <h1>What is your date of birth?</h1>
      </header>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="dob" className="text-sm text-gray-11">
            Date of Birth
          </label>
          <Textbox
            type="date"
            id="dob"
            {...register('dob', { required: true })}
          />
        </div>
      </div>

      <Button variant="primary" type="submit">
        Next
      </Button>
    </form>
  );
}
