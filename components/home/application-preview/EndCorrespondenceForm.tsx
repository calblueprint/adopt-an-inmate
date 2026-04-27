'use client';

import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { Button } from '@/components/Button';
import { EndReasonOption, endReasons } from '@/data/endCorrespondenceDropdown';
import { ApplicationDialogTabs } from './ApplicationPreviewDialog';

// schema for form
interface EndCorrespondenceForm {
  reason: EndReasonOption;
}

export default function EndCorrespondenceForm({
  onSubmit,
  setActiveTab,
}: {
  onSubmit: (data: EndCorrespondenceForm) => void;
  setActiveTab: React.Dispatch<React.SetStateAction<ApplicationDialogTabs>>;
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
        <Button
          variant="outline"
          type="button"
          onClick={() => setActiveTab('main')}
        >
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Confirm
        </Button>
      </div>
    </form>
  );
}
