'use client';

import { Resolver, useForm } from 'react-hook-form';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Slider from '@radix-ui/react-slider';
import z from 'zod';
import { Button } from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import QuestionBack from '@/components/questions/QuestionBack';
import RadioCard from '@/components/RadioCard';
import { TextArea } from '@/components/TextArea';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useApplicationNavigation } from '@/hooks/app-process';
import { useQuestionNavigaton } from '@/hooks/questions';

const agePrefFormSchema = z.object({
  hasAgePreference: z.enum(
    ['yes', 'no'],
    'Please select from one of the options below',
  ),
  minAge: z.coerce.number().min(18).max(80).optional(),
  maxAge: z.coerce.number().min(18).max(80).optional(),
});

export default function MainQuestionAge() {
  const { appState, setAppState } = useApplicationContext();
  const { nextQuestion } = useQuestionNavigaton();
  const { upsertAppInfo } = useApplicationNavigation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof agePrefFormSchema>>({
    defaultValues: {
      hasAgePreference: appState.form.agePreference ? 'yes' : 'no',
      minAge: 18,
      maxAge: 80,
    },
    // resolver: zodResolver(agePrefFormSchema),
    resolver: zodResolver(agePrefFormSchema) as Resolver<
      z.infer<typeof agePrefFormSchema>
    >,
  });

  const hasAgePref = watch('hasAgePreference');
  const minAge = watch('minAge');
  const maxAge = watch('maxAge');

  const onSubmit = async ({
    hasAgePreference,
    minAge,
    maxAge,
  }: z.infer<typeof agePrefFormSchema>) => {
    const agePref: [number, number] | undefined =
      hasAgePreference === 'yes' ? [minAge ?? 18, maxAge ?? 81] : undefined;

    upsertAppInfo({ age_pref: agePref });
    nextQuestion();

    setAppState(prev => ({
      ...prev,
      form: { ...prev.form, agePreference: agePref },
    }));

    upsertAppInfo({ age_pref: agePref });
    nextQuestion();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1">
        <header className="flex flex-col gap-2">
          <h1>Do you have an age preference? </h1>
        </header>
      </div>

      <div className="flex flex-col gap-2">
        <RadioCard value="yes" {...register('hasAgePreference')}>
          <p>Yes</p>
        </RadioCard>
        <RadioCard value="no" {...register('hasAgePreference')}>
          <p>No</p>
        </RadioCard>
      </div>

      {hasAgePref === 'yes' && (
        <div className="flex flex-col pb-12">
          <div className="pb-5">
            <hr className="border-t border-gray-200" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-48">
              <p className="text-sm text-gray-11">
                Enter in your age preference
              </p>
            </div>

            <Slider.Root
              className="relative flex w-full touch-none items-center"
              defaultValue={[18, 80]}
              min={18}
              max={80}
              step={1}
              aria-label="Age preference"
              onValueChange={vals => {
                setValue('minAge', vals[0]);
                setValue('maxAge', vals[1]);
              }}
            >
              <Slider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
                <Slider.Range className="absolute h-full bg-[#B73940]" />
              </Slider.Track>

              <Slider.Thumb className="block h-6 w-6 rounded-full border border-red-900 bg-white shadow" />
              <Slider.Thumb className="block h-6 w-6 rounded-full border border-red-900 bg-white shadow" />
            </Slider.Root>

            <div className="flex flex-row justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-gray-10">Minimum</p>
                <input
                  type="number"
                  className="h-9 rounded-lg border-2 border-gray-10"
                  value={minAge ?? 18}
                  onChange={e => setValue('minAge', parseInt(e.target.value))}
                />
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-right text-gray-10">Maximum</p>
                <input
                  type="number"
                  className="h-9 rounded-lg border-2 border-gray-10"
                  value={maxAge ?? 80}
                  onChange={e => setValue('maxAge', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-row gap-2">
        <QuestionBack />
        <Button variant="quaternary" type="submit">
          Next
        </Button>
      </div>
    </form>
  );
}
