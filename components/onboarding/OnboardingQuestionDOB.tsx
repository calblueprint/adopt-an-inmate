'use client';

import { useForm } from 'react-hook-form';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { useQuestionNavigaton } from '@/hooks/questions';
import { Button } from '../Button';
import QuestionBack from '../questions/QuestionBack';
import { Textbox } from '../Textbox';

interface PronounsForm {
  dob: string;
}

export default function OnboardingQuestionDOB() {
  const { onboardingInfo, setOnboardingInfo } = useOnboardingContext();
  const { nextQuestion } = useQuestionNavigaton();

  const { register, handleSubmit } = useForm<PronounsForm>({
    defaultValues: {
      dob: onboardingInfo.dob?.toISOString().split('T')[0],
    },
  });

  const onSubmit = ({ dob: dobString }: PronounsForm) => {
    const dob = new Date(dobString);
    setOnboardingInfo(prev => ({ ...prev, dob }));
    nextQuestion();
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

      <div className="flex items-center justify-between">
        <QuestionBack />
        <Button variant="primary" type="submit">
          Next
        </Button>
      </div>
    </form>
  );
}
