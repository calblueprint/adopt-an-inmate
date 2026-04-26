'use client';

import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
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

export default function EndCorrespondenceForm({
  onSubmit,
  children,
}: {
  onSubmit: (data: EndCorrespondenceForm) => void;
  children?: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { handleSubmit, control } = useForm<EndCorrespondenceForm>();

  return (
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

      <div className="flex items-center justify-end gap-4">
        {children}
        <Button variant="primary" type="submit">
          Confirm
        </Button>
      </div>
    </form>
  );
}
