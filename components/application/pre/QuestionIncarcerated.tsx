'use client';

import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/Button';
import RadioCard from '@/components/RadioCard';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import IneligiblePopup from './IneligiblePopup';

interface IsIncarceratedForm {
  isIncarcerated: 'true' | 'false';
}

export default function QuestionIncarcerated() {
  const { setQuestionsCompleted } = useQuestionsContext();
  const { register, handleSubmit, subscribe, setValue } =
    useForm<IsIncarceratedForm>();
  const router = useRouter();
  const searchParams = useSearchParams();

  // load form values from local storage on load
  useEffect(() => {
    const isSeekingRomance = localStorage.getItem('pre:isIncarcerated');
    if (
      isSeekingRomance &&
      (isSeekingRomance === 'true' || isSeekingRomance === 'false')
    )
      setValue('isIncarcerated', isSeekingRomance);
  }, [setValue]);

  // save form values to local storage on update
  useEffect(() => {
    const callback = subscribe({
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        localStorage.setItem('pre:isIncarcerated', values.isIncarcerated);
      },
    });

    return () => callback();
  }, [subscribe]);

  // handle submission
  const onSubmit: SubmitHandler<IsIncarceratedForm> = values => {
    const isIncarcerated = values.isIncarcerated.toLowerCase() !== 'false';
    const params = new URLSearchParams(searchParams);

    // if is incarcerated, show pop up
    if (isIncarcerated) {
      params.set('error', 'true');
      router.replace(`?${params.toString()}`);
      return;
    }

    // if not, continue to next question
    setQuestionsCompleted(prev => (prev >= 2 ? prev : 2));
    params.set('q', '2');
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <header className="flex flex-col gap-2">
          <h1>Are you currently incarcerated?</h1>
          <p className="text-sm">
            We ask this to make sure you&apos;re eligible to use this service.
            Your answers will only be stored on your device.
          </p>
        </header>

        <div className="space-y-2">
          <p className="text-sm text-gray-11">Select one</p>

          <div className="flex flex-col gap-2">
            <RadioCard value="true" {...register('isIncarcerated')}>
              <p>Yes</p>
            </RadioCard>
            <RadioCard value="false" {...register('isIncarcerated')}>
              <p>No</p>
            </RadioCard>
          </div>
        </div>

        <Button variant="primary" type="submit">
          Next
        </Button>
      </form>

      {/* dialog popup for ineligibility */}
      <IneligiblePopup reason="Adopt an Inmate is for non-incarcerated individuals seeking to help incarcerated individuals." />
    </>
  );
}
