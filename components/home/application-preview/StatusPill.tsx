import { cva } from 'class-variance-authority';
import { formatAppStatus } from '@/lib/formatters';
import { AdopterApplication } from '@/types/schema';

const statusPillStyles = cva('rounded-xl px-3 py-0.5 shadow-sm', {
  variants: {
    status: {
      PENDING: 'bg-[#FFF8D0] text-[#D39C49]',
      PENDING_CONFIRMATION: 'bg-[#FFF8D0] text-[#D39C49]',
      ACCEPTED: 'bg-[#DEF4DF] text-[#3E6430]', //need to remove
      REJECTED: 'bg-[#FFCCCC] text-[#C04444]',
      REAPPLY: 'bg-[#EBD2FF] text-[#9C64CE]',
      ENDED: 'bg-[#FDDEF3] text-[#D16FB2]',
      INCOMPLETE: 'bg-[#D9ECFF] text-[#4E7DAD]',
      ACTIVE: 'bg-[#DEF4DF] text-[#3E6430]',
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
