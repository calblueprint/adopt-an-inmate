'use client';

import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { statesDropdownOptions } from '@/data/states';
import { useQuestionAdvancer } from '@/hooks/questions';
import { Button } from '../Button';

interface StateForm {
  state: { label: string; value: string };
}

export default function OnboardingQuestionState() {
  const { control, handleSubmit } = useForm<StateForm>();
  const { setOnboardingInfo } = useOnboardingContext();
  const { advanceToQuestion } = useQuestionAdvancer();

  const onSubmit = ({ state: stateOption }: StateForm) => {
    const state = stateOption.value;
    setOnboardingInfo(prev => ({ ...prev, state }));
    advanceToQuestion(5);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <header className="flex flex-col gap-2">
        <h1>What state are you from?</h1>
      </header>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="firstName" className="text-sm text-gray-11">
            State
          </label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Select {...field} options={statesDropdownOptions} />
            )}
          />
        </div>
      </div>

      <Button variant="primary" type="submit">
        Next
      </Button>
    </form>
  );
}
