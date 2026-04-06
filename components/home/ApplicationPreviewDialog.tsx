'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dialog } from 'radix-ui';
import Logger from '@/actions/logging';
import { formatDate } from '@/lib/formatters';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { AdopterApplication } from '@/types/schema';

export default function ApplicationPreviewDialog() {
  const searchParams = useSearchParams();
  const previewId = useMemo(() => searchParams.get('preview'), [searchParams]);
  const router = useRouter();
  const [appData, setAppData] = useState<AdopterApplication | null>(null);

  useEffect(() => {
    if (!previewId) return;

    // fetch application data
    const fetchData = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('adopter_applications_dummy')
        .select()
        .eq('app_uuid', previewId)
        .maybeSingle();

      if (error) {
        Logger.error(
          `Error fetching preview for application ID ${previewId}: ${error}`,
        );
        return;
      }

      if (!data) return;

      setAppData(data);
    };

    fetchData();
  }, [previewId]);

  if (!previewId || !appData?.time_submitted) return null;

  // replace URL to / when modal closes
  const triggerNavigate = (open: boolean) => {
    if (open) return;
    router.push('/');
  };

  return (
    <Dialog.Root open defaultOpen onOpenChange={triggerNavigate}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 grid h-full w-full place-items-center bg-black/50">
          <Dialog.Content className="flex min-w-75 flex-col gap-2 rounded-lg bg-white p-10">
            <Dialog.Title className="text-3xl">
              {formatDate(appData?.time_submitted)}
            </Dialog.Title>
            <Dialog.Description>
              Submitted: {formatDate(appData?.time_submitted)}
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
