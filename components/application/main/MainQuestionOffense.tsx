'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Button } from '@/components/Button';
import CheckboxCard from '@/components/CheckboxCard';
import ErrorMessage from '@/components/ErrorMessage';
import QuestionBack from '@/components/questions/QuestionBack';
import { Textbox } from '@/components/Textbox';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useApplicationNavigation } from '@/hooks/app-process';
import { useQuestionNavigaton } from '@/hooks/questions';

const offensePrefFormSchema = z.object({
  offensePreference: z.array(z.string()).optional().nullable(),
  offenseOther: z.string().optional(),
});

type OffenseOption = 'Violent offense' | 'Harm-related offense' | 'Other:';

export default function MainQuestionOffense() {
  const { appState, setAppState } = useApplicationContext();
  const { nextQuestion } = useQuestionNavigaton();
  const { upsertAppInfo } = useApplicationNavigation();

  const initialOffensePreference = appState.form.offensePreference ?? [];
  const initialOffenseOther = appState.form.offenseOther ?? '';
  const initialPreferences = [...initialOffensePreference];

  if (initialOffenseOther.trim() && !initialPreferences.includes('Other:')) {
    initialPreferences.push('Other:');
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof offensePrefFormSchema>>({
    defaultValues: {
      offensePreference: initialPreferences,
      offenseOther: initialOffenseOther,
    },
    resolver: zodResolver(offensePrefFormSchema),
  });

  const selected = watch('offensePreference') ?? [];
  const otherValue = watch('offenseOther') ?? '';

  const toggle = (value: OffenseOption) => {
    if (selected.includes(value)) {
      setValue(
        'offensePreference',
        selected.filter(v => v !== value),
      );
      if (value === 'Other:') {
        setValue('offenseOther', '');
      }
    } else {
      setValue('offensePreference', [...selected, value]);
    }
  };

  const onSubmit = ({
    offensePreference,
    offenseOther,
  }: z.infer<typeof offensePrefFormSchema>) => {
    let selectedOffenses = offensePreference ?? [];
    selectedOffenses = selectedOffenses.filter(
      //filter to only keep non-text options
      offense =>
        offense === 'Violent offense' || offense === 'Harm-related offense',
    );

    if (offenseOther?.trim()) {
      selectedOffenses = [...selectedOffenses, offenseOther.trim()]; //add new "other" text option
    }

    setAppState(prev => ({
      ...prev,
      form: {
        ...prev.form,
        offensePreference: selectedOffenses,
        offenseOther: offenseOther ?? '',
      },
    }));
    upsertAppInfo({ offense_pref: selectedOffenses });
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
            {/* Violent offense */}
            <CheckboxCard
              value="Violent offense"
              checked={selected.includes('Violent offense')}
              {...register('offensePreference')}
              onChange={() => toggle('Violent offense')}
            >
              <p>Violent offense</p>
            </CheckboxCard>

            {/* Harm-related offense */}
            <CheckboxCard
              value="Harm-related offense"
              checked={selected.includes('Harm-related offense')}
              {...register('offensePreference')}
              onChange={() => toggle('Harm-related offense')}
            >
              <p>Harm-related offense</p>
            </CheckboxCard>

            {/* Other offense */}
            <CheckboxCard
              value={watch('offenseOther') || ''}
              checked={selected.includes('Other:') || !!otherValue.trim()}
              onChange={() => toggle('Other:')}
            >
              <p>Other:</p>

              {(selected.includes('Other:') || !!otherValue.trim()) && (
                <Textbox
                  placeholder="Please specify"
                  {...register('offenseOther')}
                  value={watch('offenseOther') || ''}
                  onChange={e => setValue('offenseOther', e.target.value)}
                  className="h-6 resize-none"
                />
              )}
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
