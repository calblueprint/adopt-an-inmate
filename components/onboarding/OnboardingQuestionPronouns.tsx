'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { useQuestionNavigaton } from '@/hooks/questions';
import { OnboardingInfo } from '@/types/types';
import { Button } from '../Button';
import ErrorMessage from '../ErrorMessage';
import QuestionBack from '../questions/QuestionBack';
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

const getDefaultValues = (
  info: Partial<OnboardingInfo>,
): z.infer<typeof pronounsFormSchema> | undefined => {
  const pronouns = info.pronouns;
  if (!pronouns) return undefined;

  if (
    pronouns === 'he/him' ||
    pronouns === 'she/her' ||
    pronouns === 'they/them'
  )
    return { pronounOption: pronouns, other: undefined };

  return { pronounOption: 'other', other: pronouns };
};

export default function OnboardingQuestionPronouns() {
  const { onboardingInfo, setOnboardingInfo } = useOnboardingContext();
  const { nextQuestion } = useQuestionNavigaton();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof pronounsFormSchema>>({
    resolver: zodResolver(pronounsFormSchema),
    defaultValues: getDefaultValues(onboardingInfo),
  });

  const onSubmit = ({
    other,
    pronounOption,
  }: z.infer<typeof pronounsFormSchema>) => {
    const pronounsChoice =
      pronounOption === 'other' ? other || '' : pronounOption;

    const pronouns = pronounsChoice.toLowerCase();

    setOnboardingInfo(prev => ({ ...prev, pronouns }));
    nextQuestion();
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

      <div className="flex items-center justify-between">
        <QuestionBack />
        <Button variant="primary" type="submit">
          Next
        </Button>
      </div>
    </form>
  );
}
