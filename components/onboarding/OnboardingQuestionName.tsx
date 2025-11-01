'use client';

import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { Button } from '../Button';
import { Textbox } from '../Textbox';

interface NameForm {
  firstName: string;
  lastName: string;
}

export default function OnboardingQuestionName() {
  const { register, handleSubmit } = useForm<NameForm>();
  const { setOnboardingInfo } = useOnboardingContext();
  const { setQuestionsCompleted } = useQuestionsContext();
  const searchParams = useSearchParams();
  const router = useRouter();

  const onSubmit = ({ firstName, lastName }: NameForm) => {
    setOnboardingInfo(prev => ({ ...prev, firstName, lastName }));
    setQuestionsCompleted(prev => (prev >= 1 ? prev : 1));

    const params = new URLSearchParams(searchParams);
    params.set('q', '1');
    router.push(`?${params.toString()}`);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <header className="flex flex-col gap-2">
        <h1>Enter your first and last name</h1>
      </header>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="firstName">First name</label>
          <Textbox
            id="firstName"
            {...register('firstName', { required: true })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="lastName">Last name</label>
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
