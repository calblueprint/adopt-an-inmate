'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Button } from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import QuestionBack from '@/components/questions/QuestionBack';
import RadioCard from '@/components/RadioCard';
import { useApplicationContext } from '@/contexts/ApplicationContext';
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

  const onSubmit = ({
    genderPreference,
  }: z.infer<typeof genderPrefFormSchema>) => {
    setAppState(prev => ({
      ...prev,
      form: { ...prev.form, genderPreference },
    }));
    nextQuestion();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <header className="flex flex-col gap-2">
        <h1>Do you have any gender preferences?</h1>
      </header>

      <div className="flex flex-col gap-4">
        <ErrorMessage
          className="w-full"
          error={errors.genderPreference?.message}
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-11">Veteran status</p>
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
        <Button variant="primary" type="submit">
          Next
        </Button>
      </div>
    </form>
  );
}
