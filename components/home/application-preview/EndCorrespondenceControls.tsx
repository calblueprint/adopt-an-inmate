'use client';

import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import Select from 'react-select';
import { Collapsible } from 'radix-ui';
import { Button } from '@/components/Button';

// options for reason
const endReasons = ['Option A', 'Option B', 'Option C'].map((r, i) => ({
  label: r,
  value: i.toString(),
}));

// schema for form
interface EndCorrespondenceForm {
  reason: { label: string; value: string };
}

export default function EndCorrespondenceControls({
  onSubmit,
}: {
  onSubmit: (data: EndCorrespondenceForm) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { handleSubmit, control } = useForm<EndCorrespondenceForm>();

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className="flex flex-col gap-1" ref={containerRef}>
        <Collapsible.Trigger asChild>
          <button className="flex items-center justify-between">
            <p className="font-bold text-gray-12">Ending Correspondence</p>
            {open ? <LuChevronUp /> : <LuChevronDown />}
          </button>
        </Collapsible.Trigger>
        <div className="h-[1px] w-full bg-gray-4" />
        <Collapsible.Content className="overflow-y-hidden data-[state='closed']:animate-[collapsible-slide-down_300ms_ease-out] data-[state='open']:animate-[collapsible-slide-up_300ms_ease-out]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 pt-4"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="reason">Please select a reason below</label>
              <Controller
                control={control}
                name="reason"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={endReasons}
                    menuPortalTarget={containerRef.current}
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-end">
              <Button variant="primary" type="submit">
                Confirm
              </Button>
            </div>
          </form>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}
