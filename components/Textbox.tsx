'use client';

import type { VariantProps } from 'class-variance-authority';
import { useState } from 'react';
import { cva } from 'class-variance-authority';
import ErrorMessage from './ErrorMessage';

const textBoxStyle = cva('', {
  variants: {
    variant: {
      default:
        'w-full rounded-lg bg-bg px-2 py-1.5 text-gray-11 placeholder:text-gray-8 outline-none ring-red-12 transition-colors duration-200 focus-visible:bg-gray-2 focus-visible:ring-1',

      borderless:
        'w-full bg-transparent pl-1 text-black outline-none border-none ring-0 shadow-none focus:ring-0 focus:outline-none focus-visible:ring-0',
    },

    isEmpty: {
      true: '',
      false: 'bg-gray-2 ring-1',
    },
  },

  compoundVariants: [
    {
      variant: 'borderless',
      className: '!bg-transparent !ring-0',
    },
  ],

  defaultVariants: {
    variant: 'default',
    isEmpty: true,
  },
});

export function Textbox({
  variant,
  className,
  error,
  onChange,
  defaultValue,
  value,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof textBoxStyle> & {
    error?: string;
  }) {
  const [isEmpty, setIsEmpty] = useState<boolean>(!(defaultValue || value));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    setIsEmpty(!e.target.value);
  };

  return (
    <div>
      <input
        {...props}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        className={textBoxStyle({ variant, className, isEmpty })}
      />
      <ErrorMessage error={error} />
    </div>
  );
}
