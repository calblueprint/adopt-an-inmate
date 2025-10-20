'use client';

import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/Button';
import RadioCard from '@/components/RadioCard';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import IneligiblePopup from './IneligiblePopup';

interface SeekingRomanceForm {
  seekingRomance: 'true' | 'false';
}

export default function QuestionSeekingRomance() {
  const { setQuestionsCompleted } = useQuestionsContext();
  const { register, handleSubmit, subscribe, setValue } =
    useForm<SeekingRomanceForm>();
  const router = useRouter();
  const searchParams = useSearchParams();

  // load form values from local storage on load
  useEffect(() => {
    const isSeekingRomance = localStorage.getItem('pre:isSeekingRomance');
    if (
      isSeekingRomance &&
      (isSeekingRomance === 'true' || isSeekingRomance === 'false')
    )
      setValue('seekingRomance', isSeekingRomance);
  }, [setValue]);

  // save form values to local storage on update
  useEffect(() => {
    const callback = subscribe({
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        localStorage.setItem('pre:isSeekingRomance', values.seekingRomance);
      },
    });

    return () => callback();
  }, [subscribe]);

  // handle submission
  const onSubmit: SubmitHandler<SeekingRomanceForm> = values => {
    const isSeekingRomance = values.seekingRomance.toLowerCase() !== 'false';
    const params = new URLSearchParams(searchParams);

    // if is seeking romance, show pop up
    if (isSeekingRomance) {
      params.set('error', 'true');
      router.replace(`?${params.toString()}`);
      return;
    }

    // if not, continue to next question
    setQuestionsCompleted(prev => (prev >= 1 ? prev : 1));
    params.set('q', '1');
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <header className="flex flex-col gap-2">
          <h1>Are you seeking romance?</h1>
          <p className="text-sm">
            We ask this to make sure you&apos;re eligible to use this service.
            Your answers will be stored on your device for convenience.
          </p>
        </header>

        <div className="space-y-2">
          <p className="text-sm text-gray-11">Select one</p>

          <div className="flex flex-col gap-2">
            <RadioCard value="true" {...register('seekingRomance')}>
              <p>Yes</p>
            </RadioCard>
            <RadioCard value="false" {...register('seekingRomance')}>
              <p>No</p>
            </RadioCard>
          </div>
        </div>

        <Button variant="primary" type="submit">
          Next
        </Button>
      </form>

      {/* dialog popup for ineligibility */}
      <IneligiblePopup reason="We are not a dating site." />
    </>
  );
}
