'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { useQuestionAdvancer } from '@/hooks/questions';
import { Button } from '../Button';
import ErrorMessage from '../ErrorMessage';
import RadioCard from '../RadioCard';

const genderFormSchema = z.object({
  gender: z.enum(
    ['male', 'female'],
    'Please select from one of the options below',
  ),
});

export default function OnboardingQuestionGender() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof genderFormSchema>>({
    resolver: zodResolver(genderFormSchema),
  });

  const { setOnboardingInfo } = useOnboardingContext();
  const { advanceToQuestion } = useQuestionAdvancer();

  const onSubmit = ({ gender }: z.infer<typeof genderFormSchema>) => {
    setOnboardingInfo(prev => ({ ...prev, gender }));
    advanceToQuestion(4);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <header className="flex flex-col gap-2">
        <h1>What are your preferred pronouns?</h1>
      </header>

      <div className="flex flex-col gap-4">
        <ErrorMessage className="w-full" error={errors.gender?.message} />
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-11">Preferred pronouns</p>
          <div className="flex flex-col gap-2">
            <RadioCard value="male" {...register('gender')}>
              <p>Male</p>
            </RadioCard>
            <RadioCard value="female" {...register('gender')}>
              <p>Female</p>
            </RadioCard>
          </div>
        </div>
      </div>

      <Button variant="primary" type="submit">
        Next
      </Button>
    </form>
  );
}
