'use client';

import { useForm } from 'react-hook-form';
import { Mina } from 'next/font/google';
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
  const currentDate = new Date();
  // const date = `${currentDate.getDate()}/${currentDate.getMonth()+1}/${currentDate.getFullYear()}`;
  const date = currentDate.toISOString().split('T')[0];
  console.log('DATE', date);

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
            max={date}
            min="1900-01-01"
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
