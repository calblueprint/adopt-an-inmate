import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { TextArea } from '@/components/TextArea';

interface RejectConfirmationForm {
  reason: string;
}

export default function RejectConfirmationForm({
  onSubmit,
}: {
  onSubmit: (data: { reason: string }) => void;
}) {
  const { handleSubmit, register } = useForm<RejectConfirmationForm>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 pt-4"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="reason">What&apos;s the reason?</label>
        <TextArea
          {...register('reason')}
          placeholder='Please be specific as possible! For example, "I just got hired and will be working 40 hour a week, so I will no longer have enough time to commit to this correspondence."'
          rows={4}
        />
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button variant="primary" type="submit">
          Reject Connection
        </Button>
      </div>
    </form>
  );
}
