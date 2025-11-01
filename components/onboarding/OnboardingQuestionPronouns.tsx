'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { useQuestionAdvancer } from '@/hooks/questions';
import { Button } from '../Button';
import ErrorMessage from '../ErrorMessage';
import RadioCard from '../RadioCard';
import { Textbox } from '../Textbox';

const pronounsFormSchema = z
  .object({
    pronounOption: z.enum(
      ['he/him', 'she/her', 'they/them', 'other'],
      'Please select from one of the options below',
    ),
    other: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.pronounOption === 'other' && !val.other)
      ctx.addIssue({
        code: 'custom',
        message: 'Please specify your pronouns',
        path: ['other'],
      });
  });

export default function OnboardingQuestionPronouns() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof pronounsFormSchema>>({
    resolver: zodResolver(pronounsFormSchema),
  });

  const { setOnboardingInfo } = useOnboardingContext();
  const { advanceToQuestion } = useQuestionAdvancer();

  const onSubmit = ({
    other,
    pronounOption,
  }: z.infer<typeof pronounsFormSchema>) => {
    const pronounsChoice =
      pronounOption === 'other' ? other || '' : pronounOption;

    const pronouns = pronounsChoice.toLowerCase();

    setOnboardingInfo(prev => ({ ...prev, pronouns }));
    advanceToQuestion(3);
  };

  const selectedPronoun = watch('pronounOption');

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <header className="flex flex-col gap-2">
        <h1>What are your preferred pronouns?</h1>
      </header>

      <div className="flex flex-col gap-4">
        <ErrorMessage
          error={errors.pronounOption?.message}
          className="w-full"
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-11">Preferred pronouns</p>
          <div className="flex flex-col gap-2">
            <RadioCard value="he/him" {...register('pronounOption')}>
              <p>He/him</p>
            </RadioCard>
            <RadioCard value="she/her" {...register('pronounOption')}>
              <p>She/her</p>
            </RadioCard>
            <RadioCard value="they/them" {...register('pronounOption')}>
              <p>They/them</p>
            </RadioCard>
            <RadioCard value="other" {...register('pronounOption')}>
              <p>Other</p>
            </RadioCard>
            {selectedPronoun === 'other' && (
              <div className="pl-4">
                <Textbox
                  error={errors.other?.message}
                  placeholder="Other pronouns"
                  {...register('other')}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Button variant="primary" type="submit">
        Next
      </Button>
    </form>
  );
}
