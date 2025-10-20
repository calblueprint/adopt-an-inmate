'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/Button';
import RadioCard from '@/components/RadioCard';
import IneligiblePopup from './IneligiblePopup';

interface SeekingRomanceForm {
  seekingRomance: 'true' | 'false';
}

export default function QuestionSeekingRomance() {
  const { register, handleSubmit } = useForm<SeekingRomanceForm>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit: SubmitHandler<SeekingRomanceForm> = values => {
    const valueBool = values.seekingRomance.toLowerCase() !== 'false';
    const params = new URLSearchParams(searchParams);

    if (valueBool) {
      params.set('error', 'true');
      router.replace(`?${params.toString()}`);
      return;
    }

    params.set('q', '1');
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <header className="flex flex-col gap-2">
          <h1>Are you seeking romance?</h1>
          <p>
            We ask this to make sure you&apos;re eligible to use this service.
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
