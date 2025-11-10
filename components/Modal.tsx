'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Modal styled like the design:
 * - Centered box with scrollable text
 * - White rounded container
 * - “Close” button at the bottom
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className={`flex h-[30.1875rem] w-[26.4375rem] flex-col rounded-2xl bg-white p-8 shadow-xl ${className}`}
      >
        {/* Header */}
        {title && (
          <h2 className="font-golos text-[1.5rem] leading-normal font-medium text-[#1E1F24]">
            {title}
          </h2>
        )}

        {/* Scrollable Text Content */}
        <div className="mt-4 flex-1 overflow-y-auto font-golos text-[0.875rem] leading-normal font-medium text-[#BABBC7]">
          {children}
        </div>

        {/* Close Button */}
        <div className="mt-8 flex justify-center border-t border-gray-200 pt-6">
          <Button
            onClick={onClose}
            className="flex h-[2.125rem] w-full max-w-[22.875rem] flex-shrink-0 items-center justify-center rounded-md bg-[#1E4240] p-[0.625rem] text-white hover:!bg-[#1E4240] active:!bg-[#1E4240]"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
