'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Dialog } from 'radix-ui';
import { Button } from '../Button';

export default function ConfirmationDialog() {
  const searchParams = useSearchParams();
  const isConfirmation = searchParams.get('confirmation');
  const router = useRouter();

  if (isConfirmation !== 'true') return null;

  // replace URL to / when modal closes
  const triggerNavigate = (open: boolean) => {
    if (open) return;
    router.replace('/');
  };

  return (
    <Dialog.Root open defaultOpen onOpenChange={triggerNavigate}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 grid h-full w-full place-items-center bg-black/50">
          <Dialog.Content className="flex max-w-120 flex-col gap-2 rounded-lg bg-white p-10">
            <Dialog.Title className="text-2xl">
              Thanks for confirming your email!
            </Dialog.Title>
            <Dialog.Description>
              You&apos;re all good to go - feel free to get started on your
              application.
            </Dialog.Description>
            <div className="mt-2 flex w-full justify-center">
              <Dialog.Close asChild>
                <Button>Close</Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
