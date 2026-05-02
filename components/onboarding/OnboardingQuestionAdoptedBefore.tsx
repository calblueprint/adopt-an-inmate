'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { useQuestionNavigaton } from '@/hooks/questions';
import AsyncButton from '../AsyncButton';
import Dropdown from '../Dropdown';
import QuestionBack from '../questions/QuestionBack';
import RadioCard from '../RadioCard';
import { Textbox } from '../Textbox';

const WHY_OPTIONS = [
  { label: 'Ended', value: 'ended' },
  { label: 'Inmate Cancelled', value: 'inmate_cancelled' },
  { label: 'NPO Cancelled', value: 'npo_cancelled' },
  { label: 'Other', value: 'other' },
];

const adoptedBeforeSchema = z
  .object({
    adoptedBefore: z.boolean(),
    stillActive: z.boolean().optional(),
    numPastActive: z.number().optional(),
    pastInactiveReason: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.adoptedBefore === false) return;

    if (data.adoptedBefore && data.stillActive === undefined)
      ctx.addIssue({
        code: 'custom',
        path: ['stillActive'],
        message: 'Please indicate if this connection is still active.',
      });

    if (data.stillActive === true && data.numPastActive === undefined)
      ctx.addIssue({
        code: 'custom',
        path: ['numPastActive'],
        message: 'Please indicate how many active connections you still have.',
      });

    if (data.stillActive === false && data.pastInactiveReason === undefined)
      ctx.addIssue({
        code: 'custom',
        path: ['pastInactiveReason'],
        message:
          'Please indicate the reason why your most recent connection ended.',
      });
  });

type AdoptedBeforeSchemaType = z.infer<typeof adoptedBeforeSchema>;

export default function OnboardingQuestionAdoptedBefore() {
  const { onboardingInfo, setOnboardingInfo } = useOnboardingContext();
  const { nextQuestion } = useQuestionNavigaton();

  const { formState, handleSubmit, control, watch } =
    useForm<AdoptedBeforeSchemaType>({
      resolver: zodResolver(adoptedBeforeSchema),
      defaultValues: {
        adoptedBefore: onboardingInfo.adoptedBefore,
        stillActive: onboardingInfo.stillActive,
        numPastActive: onboardingInfo.numPastActive,
        pastInactiveReason: onboardingInfo.pastInactiveReason,
      },
    });

  const adoptedBefore = watch('adoptedBefore');
  const stillActive = watch('stillActive');

  const onSubmit = (data: AdoptedBeforeSchemaType) => {
    setOnboardingInfo(prev => ({
      ...prev,
      adoptedBefore: data.adoptedBefore,
      stillActive: data.adoptedBefore ? data.stillActive : undefined,
      numPastActive:
        data.adoptedBefore && data.stillActive ? data.numPastActive : undefined,
      pastInactiveReason:
        data.adoptedBefore && !data.stillActive
          ? data.pastInactiveReason
          : undefined,
    }));
    nextQuestion();
  };

  return (
    // TODO: wrap in form tag once `handleSubmit` created
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <header className="flex flex-col gap-2">
        <h1>Have you adopted before?</h1>
        <p className="text-red-9">
          {formState.errors.adoptedBefore?.message ?? ''}
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {/* Have you adopted before? */}
        <div className="flex flex-col gap-2">
          <Controller
            control={control}
            name="adoptedBefore"
            render={({ field: { onChange, onBlur, value, name } }) => (
              <RadioCard
                value="yes"
                name={name}
                checked={value === true}
                onBlur={onBlur}
                onChange={() => {
                  onChange(true);
                }}
              >
                <p>Yes</p>
              </RadioCard>
            )}
          />
          <Controller
            control={control}
            name="adoptedBefore"
            render={({ field: { onChange, onBlur, value, name } }) => (
              <RadioCard
                value="no"
                name={name}
                checked={value === false}
                onBlur={onBlur}
                onChange={() => {
                  onChange(false);
                }}
              >
                <p>No</p>
              </RadioCard>
            )}
          />
        </div>

        {/* Is it still active? */}
        {adoptedBefore && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-11">
              Do you still have an active connection?
            </p>
            {formState.errors.stillActive ? (
              <p className="text-red-9">
                {formState.errors.stillActive.message}
              </p>
            ) : null}
            <div className="flex flex-col gap-2">
              <Controller
                control={control}
                name="stillActive"
                render={({ field: { onChange, onBlur, value } }) => (
                  <RadioCard
                    value="yes"
                    name="stillActive"
                    checked={value}
                    onBlur={onBlur}
                    onChange={() => {
                      onChange(true);
                    }}
                  >
                    <p>Yes</p>
                  </RadioCard>
                )}
              />
              <Controller
                control={control}
                name="stillActive"
                render={({ field: { onChange, onBlur, value } }) => (
                  <RadioCard
                    value="yes"
                    name="stillActive"
                    checked={value === false}
                    onBlur={onBlur}
                    onChange={() => {
                      onChange(false);
                    }}
                  >
                    <p>No</p>
                  </RadioCard>
                )}
              />
            </div>
          </div>
        )}

        {/* How many? */}
        {adoptedBefore && stillActive && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-11">
              How many active connections do you currently have?
            </p>
            {formState.errors.numPastActive ? (
              <p className="text-red-9">
                {formState.errors.numPastActive.message}
              </p>
            ) : null}
            <Controller
              control={control}
              name="numPastActive"
              render={({ field: { value, onChange } }) => (
                <Textbox
                  type="number"
                  min={'1'}
                  value={value ?? ''}
                  onKeyDown={e => {
                    if (['-', 'e', 'E', '.', '+', '0'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={e => onChange(parseInt(e.target.value, 10))}
                  placeholder="Enter a number"
                />
              )}
            />
          </div>
        )}

        {/* Why? */}
        {adoptedBefore && stillActive === false && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-11">
              Why did your most recent connection end?
            </p>
            {formState.errors.pastInactiveReason ? (
              <p className="text-red-9">
                {formState.errors.pastInactiveReason.message}
              </p>
            ) : null}
            <div className="relative">
              <Controller
                control={control}
                name="pastInactiveReason"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    value={value ?? ''}
                    onChange={onChange}
                    options={WHY_OPTIONS}
                    placeholder="Select Reason..."
                  />
                )}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <QuestionBack />
        <AsyncButton
          variant="primary"
          type="submit"
          loadingClassName="text-white"
          loading={formState.isLoading}
        >
          Next
        </AsyncButton>
      </div>
    </form>
  );
}
