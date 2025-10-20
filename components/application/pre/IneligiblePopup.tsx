'use client';

import { useMemo } from 'react';
import { MdErrorOutline } from 'react-icons/md';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dialog } from 'radix-ui';
import { Button } from '@/components/Button';

interface IneligiblePopupProps {
  reason: string;
}

export default function IneligiblePopup({ reason }: IneligiblePopupProps) {
  const searchParams = useSearchParams();
  const isOpen = useMemo(
    () => searchParams.get('error') === 'true',
    [searchParams],
  );

  const router = useRouter();

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('error');
    router.replace(`?${params.toString()}`);
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 grid h-full w-full place-items-center bg-black/50">
          <Dialog.Content className="flex max-w-120 flex-col gap-2 rounded-lg bg-white p-10">
            <div className="flex w-full items-center justify-center">
              <MdErrorOutline size={64} className="text-red-12" />
            </div>
            <Dialog.Title asChild>
              <h1>Sorry!</h1>
            </Dialog.Title>
            <Dialog.Description>
              Based on your answers, you&apos;re not eligible to apply as an
              Adopter for Adopt an Inmate. {reason}
            </Dialog.Description>
            <div className="mt-2 flex w-full justify-center">
              <Dialog.Close asChild>
                <Button
                  className="w-full py-2"
                  variant="primary"
                  onClick={handleClose}
                >
                  Close
                </Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
