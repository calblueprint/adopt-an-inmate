'use client';

import { useState } from 'react';
import { Button } from './Button';
import LoadingSpinner from './LoadingSpinner';

export default function AsyncButton({
  onClick,
  disabled,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = (fn?: React.MouseEventHandler<HTMLButtonElement>) => {
    return async (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsProcessing(true);
      await fn?.(e);
      setIsProcessing(false);
    };
  };

  return (
    <Button
      onClick={handleClick(onClick)}
      disabled={disabled || isProcessing}
      {...props}
    >
      {children}
      {isProcessing && <LoadingSpinner className="ml-2" />}
    </Button>
  );
}
