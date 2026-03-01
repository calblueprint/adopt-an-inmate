'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { TextArea } from '@/components/TextArea';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useApplicationNavigation } from '@/hooks/app-process';
import { useQuestionNavigaton } from '@/hooks/questions';

interface AgeForm {
  age: string;
}

export default function MainQuestionAge() {
  const { appState, setAppState } = useApplicationContext();
  const { nextQuestion } = useQuestionNavigaton();
  const { upsertAppInfo } = useApplicationNavigation();

  const {
    register,
    handleSubmit,
    //formState: { errors },
  } = useForm<AgeForm>({
    defaultValues: {
      age: appState.form.agePreference,
    },
  });

  const onSubmit = async ({ age }: AgeForm) => {
    setAppState(prev => ({ ...prev, form: { ...prev.form, age } }));
    upsertAppInfo({ age_pref: age }); //new upsert helper
    nextQuestion();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1">
        <header className="flex flex-col gap-2">
          <h1>
            What is your preference for the age of your adoptee? Please enter a
            valid range. <sup className="text-red-600">*</sup>{' '}
          </h1>
        </header>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <TextArea id="age" {...register('age', { required: true })} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div />
        <Button variant="primary" type="submit">
          Next
        </Button>
      </div>
    </form>
  );
}
