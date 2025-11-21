'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils';

export default function CheckboxCard({
  children,
  className,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'>) {
  const id = useId();

  return (
    <label
      className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-7 px-2 py-1 transition-colors has-[input:checked]:border-red-12"
      htmlFor={id}
    >
      <input
        type="checkbox"
        id={id}
        className={cn(
          className,
          'relative size-4 appearance-none rounded-full border-2 border-red-12 transition-colors after:absolute after:top-1/2 after:left-1/2 after:block after:size-2 after:-translate-1/2 after:rounded-full after:bg-red-12 after:opacity-0 after:transition-opacity after:content-[""] checked:after:opacity-100',
        )}
        {...props}
      />
      {children}
    </label>
  );
}
