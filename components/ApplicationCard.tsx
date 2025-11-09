import { Button } from '@/components/Button';

export default function ApplicationCard() {
  return (
    <div className="flex w-55 flex-col rounded-2xl border-2 border-[#1E4240] bg-white">
      <div className="flex flex-col gap-y-30">
        <div className="flex flex-row justify-end pt-3 pr-3">
          <Button variant="applicationCard">...</Button>
        </div>

        <div className="flex flex-col pb-3 pl-3">
          <p className="text-base text-red-12">10/10/2025</p>
          <p className="text-xs text-gray-10">Status: Pending</p>
        </div>
      </div>
    </div>
  );
}
