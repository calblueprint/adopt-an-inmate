'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Button } from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import QuestionBack from '@/components/questions/QuestionBack';
import RadioCard from '@/components/RadioCard';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useAppProcess } from '@/hooks/app-process';
import { useQuestionNavigaton } from '@/hooks/questions';

const genderPrefFormSchema = z.object({
  genderPreference: z.enum(
    ['male', 'female', 'no_preference'],
    'Please select from one of the options below',
  ),
});

export default function MainQuestionGender() {
  const { appState, setAppState } = useApplicationContext();
  const { nextQuestion } = useQuestionNavigaton();
  const { upsertAppInfo } = useAppProcess();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof genderPrefFormSchema>>({
    defaultValues: {
      genderPreference: appState.form.genderPreference,
    },
    resolver: zodResolver(genderPrefFormSchema),
  });

  const onSubmit = async ({
    genderPreference,
  }: z.infer<typeof genderPrefFormSchema>) => {
    setAppState(prev => ({
      ...prev,
      form: { ...prev.form, genderPreference },
    }));

    upsertAppInfo({ gender_pref: genderPreference }); //new upsert helper
    nextQuestion();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <header className="flex flex-col gap-2">
        <h1>
          Do you have a gender preference?
          <sup className="text-red-600">*</sup>
        </h1>
      </header>

      <div className="flex flex-col gap-4">
        <ErrorMessage
          className="w-full"
          error={errors.genderPreference?.message}
        />
        <div className="mb-[8vh] flex flex-col gap-1">
          <div className="flex flex-col gap-2">
            <RadioCard value="male" {...register('genderPreference')}>
              <p>Male</p>
            </RadioCard>
            <RadioCard value="female" {...register('genderPreference')}>
              <p>Female</p>
            </RadioCard>
            <RadioCard value="no_preference" {...register('genderPreference')}>
              <p>No preference</p>
            </RadioCard>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <QuestionBack />
        <Button variant="quaternary" type="submit">
          Next
        </Button>
      </div>
    </form>
  );
}
