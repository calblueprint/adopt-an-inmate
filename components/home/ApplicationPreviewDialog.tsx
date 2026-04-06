'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dialog } from 'radix-ui';
import { getApplicationWithAdoptees } from '@/actions/applications/getApplication';
import Logger from '@/actions/logging';
import {
  capitalize,
  formatAgePreference,
  formatDate,
  formatGenderPreference,
} from '@/lib/formatters';
import { ApplicationWithAdoptees } from '@/types/schema';

export default function ApplicationPreviewDialog() {
  const searchParams = useSearchParams();
  const showPreview = useMemo(
    () => searchParams.get('dialog') === 'preview',
    [searchParams],
  );
  const previewId = useMemo(() => searchParams.get('preview'), [searchParams]);
  const router = useRouter();
  const [appData, setAppData] = useState<ApplicationWithAdoptees>(null);

  useEffect(() => {
    if (!previewId) return;

    // fetch application data
    const fetchData = async () => {
      const { data, error } = await getApplicationWithAdoptees(previewId);

      if (error) {
        Logger.error(
          `Error fetching preview for application ID ${previewId}: ${error}`,
        );
        return;
      }

      if (!data) {
        Logger.error(`No such application ${previewId}`);
        return;
      }

      setAppData(data);
    };

    fetchData();
  }, [previewId]);

  // determine app status/step
  const statusText = useMemo(() => {
    if (!appData) return '';
    return 'Admin is currently reviewing your application.';
  }, [appData]);

  if (!(showPreview && previewId && appData?.time_submitted)) return null;

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
              {formatDate(appData.time_submitted)}
            </Dialog.Title>

            <main className="flex flex-col gap-6">
              <Dialog.Description>
                Submitted: {formatDate(appData.time_submitted)}
              </Dialog.Description>

              {/* status */}
              <div className="flex items-center gap-3 text-sm">
                <p className="rounded-lg bg-yellow-6 px-2 py-0.5 shadow-sm">
                  {capitalize(appData.status.toLowerCase())}
                </p>
                <p className="font-bold text-gray-11 italic">{statusText}</p>
              </div>

              {/* bio */}
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-gray-9">Biography</p>
                <p>{appData.personal_bio}</p>
              </div>

              {/* gender preference */}
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-gray-9">
                  Gender Preference
                </p>
                <p>{formatGenderPreference(appData.gender_pref)}</p>
              </div>

              {/* age preference */}
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-gray-9">Age Preference</p>
                <p>{formatAgePreference(appData.age_pref, 'standard')}</p>
              </div>

              {/* ranking */}
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-gray-9">Adoptee Ranking</p>
                <ol>
                  {appData.adoptees?.map((a, idx) => (
                    <li key={a.id}>
                      {idx + 1}. {a.first_name}
                    </li>
                  ))}
                </ol>
              </div>
            </main>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
