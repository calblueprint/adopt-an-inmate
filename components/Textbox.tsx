'use client';

import { useState } from 'react';
import { cva } from 'class-variance-authority';
import ErrorMessage from './ErrorMessage';

const textBoxStyle = cva('', {
  variants: {
    variant: {
      default:
        'w-full rounded-lg bg-bg px-2 py-1.5 text-gray-11 placeholder:text-gray-8 outline-none ring-gray-11 transition-colors duration-200 focus-visible:bg-gray-2 focus-visible:ring-1',
    },
    isEmpty: {
      true: '',
      false: 'bg-gray-2 ring-1',
    },
  },
  defaultVariants: {
    variant: 'default',
    isEmpty: true,
  },
});

export function Textbox({
  className,
  error,
  onChange,
  defaultValue,
  value,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  const [isEmpty, setIsEmpty] = useState<boolean>(!(defaultValue || value));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    setIsEmpty(!(value || e.target.value));
  };

  return (
    <div>
      <input
        {...props}
        onChange={handleChange}
        className={textBoxStyle({ className, isEmpty, variant: 'default' })}
      />
      <ErrorMessage error={error} />
    </div>
  );
}
