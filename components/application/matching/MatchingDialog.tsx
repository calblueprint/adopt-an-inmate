'use client';

import { useEffect, useMemo, useState } from 'react';
import { LuCalendar, LuMapPin, LuUser, LuX } from 'react-icons/lu';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dialog } from 'radix-ui';
import { Button } from '@/components/Button';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { getStateAbbv } from '@/lib/utils';

export default function MatchingDialog() {
  const [adopteeIndex, setAdopteeIndex] = useState(-1);
  const searchParams = useSearchParams();
  const router = useRouter();

  const { appState } = useApplicationContext();
  const match = useMemo(
    () =>
      appState.matches && adopteeIndex > -1 && adopteeIndex < 4
        ? appState.matches[adopteeIndex]
        : null,
    [appState, adopteeIndex],
  );

  useEffect(() => {
    const detailsIndex = parseInt(searchParams.get('details') ?? '-1', 10);
    setAdopteeIndex(detailsIndex);
  }, [searchParams]);

  const handleOpenChange = (open: boolean) => {
    if (open) return;
    const params = new URLSearchParams(searchParams);
    params.delete('details');
    router.replace(`?${params.toString()}`);
  };

  return (
    <Dialog.Root open={adopteeIndex !== -1} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 grid h-full w-full place-items-center bg-black/50">
          <Dialog.Content className="relative flex max-w-120 flex-col gap-2 rounded-lg bg-gray-1 p-8">
            <div className="absolute top-4 right-4">
              <Dialog.Close asChild>
                <Button variant="ghost">
                  <LuX size={16} />
                </Button>
              </Dialog.Close>
            </div>
            <Dialog.Title asChild>
              <h1>{match?.name}</h1>
            </Dialog.Title>
            <Dialog.Description className="hidden">
              Match details pop-up
            </Dialog.Description>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <LuCalendar size={16} />
                <p>{match?.age}</p>
              </div>
              <div className="flex items-center gap-2">
                <LuUser size={16} />
                <p className="capitalize">{match?.gender}</p>
              </div>
              <div className="flex items-center gap-2">
                <LuMapPin size={16} />
                <p>{getStateAbbv(match?.state ?? '')}</p>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <p className="text-xs font-semibold text-gray-8 uppercase">
                Biography
              </p>
              <p>{match?.bio}</p>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
