'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Button } from '@/components/Button';
import CheckboxCard from '@/components/CheckboxCard';
import ErrorMessage from '@/components/ErrorMessage';
import QuestionBack from '@/components/questions/QuestionBack';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useApplicationNavigation } from '@/hooks/app-process';
import { useQuestionNavigaton } from '@/hooks/questions';

const offensePrefFormSchema = z.object({
  offensePreference: z.array(
    z.enum(['Violent offense', 'Harm-related offense', 'Other:']),
  ),
});

type OffenseOption = 'Violent offense' | 'Harm-related offense' | 'Other:';

export default function MainQuestionOffense() {
  const { appState, setAppState } = useApplicationContext();
  const { nextQuestion } = useQuestionNavigaton();
  const { upsertAppInfo } = useApplicationNavigation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof offensePrefFormSchema>>({
    defaultValues: {
      offensePreference: appState.form.offensePreference ?? [],
    },
    resolver: zodResolver(offensePrefFormSchema),
  });

  const selected = watch('offensePreference');

  const toggle = (value: OffenseOption) => {
    if (selected.includes(value)) {
      setValue(
        'offensePreference',
        selected.filter(v => v !== value),
      );
    } else {
      setValue('offensePreference', [...selected, value]);
    }
  };

  const onSubmit = ({
    offensePreference,
  }: z.infer<typeof offensePrefFormSchema>) => {
    setAppState(prev => ({
      ...prev,
      form: { ...prev.form, offensePreference },
    }));
    upsertAppInfo({ offense_pref: offensePreference }); //new upsert helper
    nextQuestion();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <header className="flex flex-col gap-2">
        <h1>Which offenses would you absolutely not want to match with?</h1>
      </header>

      <div className="flex flex-col gap-4">
        <ErrorMessage
          className="w-full"
          error={errors.offensePreference?.message}
        />

        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-11">
            Select all that apply. (optional)
          </p>

          <div className="flex flex-col gap-2">
            {/* Option 1 */}
            <CheckboxCard
              value="Violent offense"
              checked={selected.includes('Violent offense')}
              {...register('offensePreference')}
              onChange={() => toggle('Violent offense')}
            >
              <p>Violent offense</p>
            </CheckboxCard>

            {/* Option 2 */}
            <CheckboxCard
              value="Harm-related offense"
              checked={selected.includes('Harm-related offense')}
              {...register('offensePreference')}
              onChange={() => toggle('Harm-related offense')}
            >
              <p>Harm-related offense</p>
            </CheckboxCard>

            {/* Option 3 */}
            <CheckboxCard
              value="Other:"
              checked={selected.includes('Other:')}
              {...register('offensePreference')}
              onChange={() => toggle('Other:')}
            >
              <p>Other:</p>
            </CheckboxCard>
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
