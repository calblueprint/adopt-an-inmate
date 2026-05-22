'use client';

import React, { useId } from 'react';

// import { cn } from '@/lib/utils';

export default function RadioCard({
  children,
  // className,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'>) {
  const id = useId();

  return (
    <label
      className="padding-6 flex cursor-pointer items-center gap-3 rounded-lg border-0 bg-input p-2 has-[input:checked]:border-red-9 has-[input:checked]:bg-red-9 has-[input:checked]:text-white"
      htmlFor={id}
    >
      <input
        type="radio"
        id={id}
        className="hidden"
        // className={cn(
        //   className,
        //   'relative size-4 appearance-none rounded-full border-2 border-red-12 transition-colors after:absolute after:top-1/2 after:left-1/2 after:block after:size-2 after:-translate-1/2 after:rounded-full after:bg-red-12 after:opacity-0 after:transition-opacity after:content-[""] checked:after:opacity-100',
        // )}
        {...props}
      />
      <span className="ml-1">{children}</span>
    </label>
  );
}
