'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Button } from '@/components/Button';
import CheckboxCard from '@/components/CheckboxCard';
import ErrorMessage from '@/components/ErrorMessage';
import QuestionBack from '@/components/questions/QuestionBack';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useQuestionNavigaton } from '@/hooks/questions';

const offensePrefFormSchema = z.object({
  offensePreference: z
    .array(z.enum(['Option 1', 'Option 2', 'Option 3', 'None']))
    .min(1, 'Please select at least one option'),
});

type OffenseOption = 'Option 1' | 'Option 2' | 'Option 3' | 'None';

export default function MainQuestionOffense() {
  const { appState, setAppState } = useApplicationContext();
  const { nextQuestion } = useQuestionNavigaton();

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
            Select all that apply. If you have no preference, select None.
          </p>

          <div className="flex flex-col gap-2">
            {/* Option 1 */}
            <CheckboxCard
              value="Option 1"
              checked={selected.includes('Option 1')}
              {...register('offensePreference')}
              onChange={() => toggle('Option 1')}
            >
              <p>Option 1</p>
            </CheckboxCard>

            {/* Option 2 */}
            <CheckboxCard
              value="Option 2"
              checked={selected.includes('Option 2')}
              {...register('offensePreference')}
              onChange={() => toggle('Option 2')}
            >
              <p>Option 2</p>
            </CheckboxCard>

            {/* Option 3 */}
            <CheckboxCard
              value="Option 3"
              checked={selected.includes('Option 3')}
              {...register('offensePreference')}
              onChange={() => toggle('Option 3')}
            >
              <p>Option 3</p>
            </CheckboxCard>

            {/* None */}
            <CheckboxCard
              value="None"
              checked={selected.includes('None')}
              {...register('offensePreference')}
              onChange={() => toggle('None')}
            >
              <p>None</p>
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
