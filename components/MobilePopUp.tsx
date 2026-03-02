// MobilePopUp.tsx
'use client';

import { Dialog } from 'radix-ui';
import { Button } from '@/components/Button';

interface MobilePopUpProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function MobilePopUp({
  open,
  onClose,
  title,
  children,
}: MobilePopUpProps) {
  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 grid place-items-center bg-black/50">
          <Dialog.Content className="flex h-[21.3125rem] w-[19.1875rem] flex-col rounded-lg bg-white p-4">
            {title && (
              <Dialog.Title className="mb-3 font-['Golos_Text'] text-[1.25rem] font-medium text-[#1E1F24]">
                {title}
              </Dialog.Title>
            )}

            <div className="flex-1 overflow-y-auto">{children}</div>

            <div className="mt-4 flex justify-center">
              <Button
                variant="primary"
                onClick={onClose}
                className="flex h-[2.5625rem] w-[17.375rem] items-center justify-center rounded-[0.36888rem] bg-[#1E4240] p-[0.46113rem] text-white"
              >
                Close
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
