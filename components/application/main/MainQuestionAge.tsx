'use client';

import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Slider } from 'radix-ui';
import z from 'zod';
import { Button } from '@/components/Button';
import QuestionBack from '@/components/questions/QuestionBack';
import RadioCard from '@/components/RadioCard';
import { Textbox } from '@/components/Textbox';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useApplicationNavigation } from '@/hooks/app-process';
import { useQuestionNavigaton } from '@/hooks/questions';

const agePrefFormSchema = z
  .object({
    hasAgePreference: z.enum(
      ['yes', 'no'],
      'Please select from one of the options below',
    ),
    minAge: z.coerce
      .number()
      .min(18, { message: 'Minimum age is 18.' })
      .max(80, { message: 'Maximum age is 80.' })
      .optional(),
    maxAge: z.coerce
      .number()
      .min(18, { message: 'Minimum age is 18.' })
      .max(80, { message: 'Maximum age is 80.' })
      .optional(),
  })
  .refine(
    data => {
      if (data.hasAgePreference === 'yes') {
        return data.minAge !== undefined && data.maxAge !== undefined;
      }
      return true;
    },
    {
      message: 'Please enter both a minimum and maximum age.',
      path: ['minAge'],
    },
  )
  .refine(
    data => {
      if (
        data.hasAgePreference === 'yes' &&
        data.minAge !== undefined &&
        data.maxAge !== undefined
      ) {
        return data.minAge <= data.maxAge;
      }
      return true;
    },
    {
      message: 'Minimum age cannot exceed maximum age.',
      path: ['minAge'],
    },
  );

export default function MainQuestionAge() {
  const { appState, setAppState } = useApplicationContext();
  const { nextQuestion } = useQuestionNavigaton();
  const { upsertAppInfo } = useApplicationNavigation();

  // Read saved values from appState first
  const savedPref = appState.form.agePreference;

  const [minAgeDisplay, setMinAgeDisplay] = useState<string>(
    savedPref ? String(savedPref[0]) : '18',
  );
  const [maxAgeDisplay, setMaxAgeDisplay] = useState<string>(
    savedPref ? (savedPref[1] === 80 ? '80+' : String(savedPref[1])) : '80+',
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof agePrefFormSchema>>({
    defaultValues: {
      hasAgePreference: appState.form.agePreference ? 'yes' : undefined,
      minAge: savedPref?.[0] ?? 18,
      maxAge: savedPref?.[1] ?? 80,
    },
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
      hasAgePreference === 'yes'
        ? [
            parseInt(String(minAge ?? 18), 10),
            parseInt(String(maxAge ?? 80), 10),
          ]
        : undefined;

    setAppState(prev => ({
      ...prev,
      form: { ...prev.form, agePreference: agePref },
    }));

    await upsertAppInfo({ age_pref: agePref });
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
              value={[minAge ?? 18, maxAge ?? 80]}
              min={18}
              max={80}
              step={1}
              aria-label="Age preference"
              onValueChange={vals => {
                setValue('minAge', vals[0]);
                setValue('maxAge', vals[1]);
                setMinAgeDisplay(String(vals[0]));
                setMaxAgeDisplay(vals[1] === 80 ? '80+' : String(vals[1]));
              }}
            >
              <Slider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
                <Slider.Range className="absolute h-full bg-[#B73940]" />
              </Slider.Track>

              <Slider.Thumb className="block h-6 w-6 rounded-full border border-red-900 bg-white shadow-md/25" />
              <Slider.Thumb className="block h-6 w-6 rounded-full border border-red-900 bg-white shadow-md/25" />
            </Slider.Root>

            <div className="flex flex-row justify-between gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-gray-10">Minimum</p>
                <Textbox
                  className="h-9 rounded-lg border-1 border-gray-10 pl-2"
                  value={minAgeDisplay}
                  maxLength={2}
                  onChange={e => {
                    const raw = e.target.value;
                    setMinAgeDisplay(raw);
                    const parsed = parseInt(raw);
                    setValue('minAge', isNaN(parsed) ? undefined : parsed, {
                      shouldValidate: true,
                    });
                  }}
                ></Textbox>
                {errors.minAge?.type === 'too_small' && (
                  <p className="text-sm text-red-600"> Minimum age is 18.</p>
                )}
                {minAgeDisplay.trim() === '' && (
                  <p className="text-sm text-red-600"> Please enter an age.</p>
                )}
                {errors.minAge?.message &&
                  errors.minAge.type !== 'too_small' &&
                  minAgeDisplay.trim() !== '' && (
                    <p className="text-sm text-red-600">
                      {errors.minAge.message}
                    </p>
                  )}
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-right text-gray-10">Maximum</p>
                <Textbox
                  className="h-9 rounded-lg border-1 border-gray-10 pr-2 text-right"
                  value={maxAgeDisplay}
                  maxLength={2}
                  onChange={e => {
                    const raw = e.target.value.replace('+', '');
                    setMaxAgeDisplay(
                      raw === '' ? '' : parseInt(raw) >= 80 ? '80+' : raw,
                    );
                    const parsed = parseInt(raw);
                    if (!isNaN(parsed)) {
                      setValue('maxAge', parsed, { shouldValidate: true });
                    } else {
                      setValue('maxAge', undefined, { shouldValidate: true });
                    }
                  }}
                ></Textbox>

                {maxAgeDisplay.trim() === '' && (
                  <p className="text-sm text-red-600">Please enter an age.</p>
                )}
                {errors.maxAge?.type === 'too_big' && (
                  <p className="text-sm text-red-600">Maximum age is 80+.</p>
                )}
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
