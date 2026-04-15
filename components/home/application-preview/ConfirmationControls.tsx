'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Button } from '@/components/Button';
import RadioCard from '@/components/RadioCard';
import { Textbox } from '@/components/Textbox';

// form schema
const confirmationFormSchema = z
  .object({
    confirmation: z.enum(['yes', 'no']),
    reason: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.confirmation === 'no' && !val.reason)
      ctx.addIssue({
        code: 'custom',
        message: 'Please specify a reason',
        path: ['reason'],
      });
  });

export type ConfirmationFormValues = z.infer<typeof confirmationFormSchema>;

export default function ConfirmationControls({
  onSubmit,
}: {
  onSubmit: (data: ConfirmationFormValues) => void;
}) {
  const { register, handleSubmit, watch } = useForm<ConfirmationFormValues>({
    resolver: zodResolver(confirmationFormSchema),
  });

  const selectedConfirmation = watch('confirmation');

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <p className="font-bold text-gray-12">
        Do you confirm that you will communicate with your adoptee?
      </p>

      <div className="flex gap-2">
        <RadioCard value="yes" {...register('confirmation')}>
          Yes
        </RadioCard>
        <RadioCard value="no" {...register('confirmation')}>
          No
        </RadioCard>
      </div>

      {selectedConfirmation === 'no' && (
        <div className="flex flex-col gap-1">
          <label htmlFor="reason">Why?</label>
          <Textbox {...register('reason')} />
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </div>
    </form>
  );
}
