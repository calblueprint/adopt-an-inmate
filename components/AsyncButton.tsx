'use client';

import { useState } from 'react';
import { Button } from './Button';
import LoadingSpinner from './LoadingSpinner';

export default function AsyncButton({
  onClick,
  disabled,
  children,
  loading = false,
  loadingClassName,
  ...props
}: React.ComponentProps<typeof Button> & {
  loading?: boolean;
  loadingClassName?: string | undefined;
}) {
  const [isProcessing, setIsProcessing] = useState(loading);

  const handleClick = (fn?: React.MouseEventHandler<HTMLButtonElement>) => {
    return async (e: React.MouseEvent<HTMLButtonElement>) => {
      // if loading is controlled, just call the function
      if (loading) {
        await fn?.(e);
        return;
      }

      setIsProcessing(true);
      await fn?.(e);
      setIsProcessing(false);
    };
  };

  return (
    <Button
      onClick={handleClick(onClick)}
      disabled={loading || disabled || isProcessing}
      {...props}
    >
      {children}
      {(loading || isProcessing) && (
        <LoadingSpinner className={loadingClassName} />
      )}
    </Button>
  );
}
