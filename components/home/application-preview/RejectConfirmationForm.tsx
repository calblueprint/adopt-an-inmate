import { useForm } from 'react-hook-form';
import AsyncButton from '@/components/AsyncButton';
import { TextArea } from '@/components/TextArea';

interface RejectConfirmationForm {
  reason: string;
}

export default function RejectConfirmationForm({
  onSubmit,
}: {
  onSubmit: (data: { reason: string }) => Promise<void>;
}) {
  const { handleSubmit, register, formState } =
    useForm<RejectConfirmationForm>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 pt-4"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="reason">What&apos;s the reason?</label>
        <TextArea
          {...register('reason')}
          placeholder="Please be specific as possible!"
          rows={4}
        />
      </div>

      <div className="flex items-center justify-end gap-4">
        <AsyncButton
          variant="primary"
          type="submit"
          loading={formState.isSubmitting}
        >
          Reject Connection
        </AsyncButton>
      </div>
    </form>
  );
}
