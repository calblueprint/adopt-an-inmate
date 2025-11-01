'use client';

import { useForm } from 'react-hook-form';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { useQuestionAdvancer } from '@/hooks/questions';
import { Button } from '../Button';
import { Textbox } from '../Textbox';

interface NameForm {
  firstName: string;
  lastName: string;
}

export default function OnboardingQuestionName() {
  const { register, handleSubmit } = useForm<NameForm>();
  const { setOnboardingInfo } = useOnboardingContext();
  const { advanceToQuestion } = useQuestionAdvancer();

  const onSubmit = ({ firstName, lastName }: NameForm) => {
    setOnboardingInfo(prev => ({ ...prev, firstName, lastName }));
    advanceToQuestion(1);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <header className="flex flex-col gap-2">
        <h1>What is your first and last name?</h1>
      </header>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="firstName" className="text-sm text-gray-11">
            First name
          </label>
          <Textbox
            id="firstName"
            {...register('firstName', { required: true })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="lastName" className="text-sm text-gray-11">
            Last name
          </label>
          <Textbox
            id="lastName"
            {...register('lastName', { required: true })}
          />
        </div>
      </div>

      <Button variant="primary" type="submit">
        Next
      </Button>
    </form>
  );
}
