'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { upsertApplication } from '@/actions/queries/query';
import { Button } from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import QuestionBack from '@/components/questions/QuestionBack';
import RadioCard from '@/components/RadioCard';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useAuth } from '@/contexts/AuthProvider';
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
  const { userId } = useAuth();

  const devUserId = '297a39c3-a21f-4ec7-86e1-cc3c003cda26'; //delete

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

    try {
      await upsertApplication({
        adopter_uuid: devUserId ?? userId!,
        app_uuid: appState.appId,
        gender_pref: genderPreference,
      });
    } catch (error) {
      console.error('Failed to save application:', error);
    }

    nextQuestion();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <header className="flex flex-col gap-2">
        <h1>
          Do you have any gender preferences?
          <sup className="text-red-600">*</sup>
        </h1>
      </header>

      <div className="flex flex-col gap-4">
        <ErrorMessage
          className="w-full"
          error={errors.genderPreference?.message}
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-11">Gender preference</p>
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
