import { cva } from 'class-variance-authority';
import { formatAppStatus } from '@/lib/formatters';
import { AdopterApplication } from '@/types/schema';

const statusPillStyles = cva('rounded-xl px-3 py-0.5 shadow-sm', {
  variants: {
    status: {
      PENDING: 'bg-yellow-6',
      PENDING_CONFIRMATION: 'bg-yellow-6',
      ACCEPTED: 'bg-green-100',
      REJECTED: 'bg-red-6',
      REAPPLY: 'bg-blue-100',
      ENDED: 'bg-pink-200',
      INCOMPLETE: 'bg-pink-300',
    },
  },
});

export default function StatusPill({
  status,
}: {
  status: AdopterApplication['status'];
}) {
  return (
    <p className={statusPillStyles({ status })}>{formatAppStatus(status)}</p>
  );
}
