import { cva } from 'class-variance-authority';
import { formatAppStatus } from '@/lib/formatters';
import { AdopterApplication } from '@/types/schema';

const statusPillStyles = cva('rounded-xl px-3 py-0.5 shadow-sm', {
  variants: {
    status: {
      PENDING: 'bg-[#FFF8D0] text-[#FFF4B6]',
      PENDING_CONFIRMATION: 'bg-[#FFF8D0] text-[#FFF4B6]',
      ACCEPTED: 'bg-[#DEF4DF] text-[#CDEACF]',
      REJECTED: 'bg-[#FFCCCC] text-[#FFC0C0]',
      REAPPLY: 'bg-[#EBD2FF] text-[#E5C5FF]',
      ENDED: 'bg-[#FDDEF3] text-[#FDD4EE]',
      INCOMPLETE: 'bg-[#D9ECFF] text-[#CCE5FF]',
      ACTIVE: 'bg-[#DEF4DF] text-[#CDEACF]',
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
