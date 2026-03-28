'use client';

import { useState } from 'react';
import { SlArrowDown } from 'react-icons/sl';
import { cn } from '@/lib/utils';

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  value: string | null;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = 'Select...',
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const selected = options.find(o => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="flex w-full items-center justify-between rounded-lg border border-red-12 px-3 py-2 text-sm transition-colors"
      >
        <span className={value ? 'text-gray-12' : 'text-gray-10'}>
          {selected?.label || placeholder}
        </span>

        <SlArrowDown
          className={cn(
            'text-gray-10 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-red-12 bg-white shadow-md">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-red-2 hover:text-red-12"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
