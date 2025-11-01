'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { useSubmitOnboarding } from '@/hooks/onboarding';
import { useQuestionNavigaton } from '@/hooks/questions';
import AsyncButton from '../AsyncButton';
import ErrorMessage from '../ErrorMessage';
import QuestionBack from '../questions/QuestionBack';
import RadioCard from '../RadioCard';

const veteranFormSchema = z.object({
  veteran: z.enum(['yes', 'no'], 'Please select from one of the options below'),
});

export default function OnboardingQuestionVeteran() {
  const { onboardingInfo, setOnboardingInfo } = useOnboardingContext();
  const { submitOnboardingInfo } = useSubmitOnboarding();
  const { nextQuestion } = useQuestionNavigaton();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    subscribe,
  } = useForm<z.infer<typeof veteranFormSchema>>({
    resolver: zodResolver(veteranFormSchema),
    defaultValues: {
      veteran:
        onboardingInfo.isVeteran !== undefined
          ? onboardingInfo.isVeteran
            ? 'yes'
            : 'no'
          : undefined,
    },
  });

  subscribe({
    formState: {
      isDirty: true,
    },
    callback: ({ values: { veteran } }) => {
      const isVeteran = veteran === 'yes';
      setOnboardingInfo(prev => ({ ...prev, isVeteran }));
    },
  });

  const onSubmit = async ({ veteran }: z.infer<typeof veteranFormSchema>) => {
    const isVeteran = veteran === 'yes';
    setOnboardingInfo(prev => ({ ...prev, isVeteran }));
    await submitOnboardingInfo();

    // this would navigate to the success screen
    nextQuestion();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <header className="flex flex-col gap-2">
        <h1>Are you a veteran?</h1>
      </header>

      <div className="flex flex-col gap-4">
        <ErrorMessage className="w-full" error={errors.veteran?.message} />
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-11">Veteran status</p>
          <div className="flex flex-col gap-2">
            <RadioCard value="yes" {...register('veteran')}>
              <p>Yes, I am a veteran</p>
            </RadioCard>
            <RadioCard value="no" {...register('veteran')}>
              <p>No, I am not a veteran</p>
            </RadioCard>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <QuestionBack />
        <AsyncButton
          variant="primary"
          type="submit"
          loadingClassName="text-white"
          loading={isSubmitting}
        >
          Submit
        </AsyncButton>
      </div>
    </form>
  );
}
