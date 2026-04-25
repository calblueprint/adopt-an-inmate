'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dialog } from 'radix-ui';
import { getApplicationWithAdoptees } from '@/actions/applications/getApplicationWithAdoptees';
import { handleAdopterConfirmation as handleAdopterConfirmationServer } from '@/actions/applications/handleAdopterConfirmation';
import Logger from '@/actions/logging';
import { formatAppDateByStatus } from '@/lib/formatters';
import { AdopterApplication, ApplicationWithAdoptees } from '@/types/schema';
import { AdopterApplicationFormValues } from './AdopterApplicationFormValues';
import AppCallout from './AppCallout';
import ConfirmationControls from './ConfirmationControls';
import EndCorrespondenceControls from './EndCorrespondenceControls';
import StatusPill from './StatusPill';

export default function ApplicationPreviewDialog() {
  const searchParams = useSearchParams();
  const showPreview = useMemo(
    () => searchParams.get('dialog') === 'preview',
    [searchParams],
  );
  const previewId = useMemo(() => searchParams.get('preview'), [searchParams]);
  const router = useRouter();
  const [appData, setAppData] = useState<ApplicationWithAdoptees>(null);
  const historyStatuses = ['REAPPLY', 'REJECTED', 'ENDED'];

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

  const timeText = useMemo(() => {
    if (!appData) return '';
    return formatAppDateByStatus(appData);
  }, [appData]);

  // app controls
  const showAdopterFormValues = useMemo(() => {
    const showFormStatuses: AdopterApplication['status'][] = [
      'PENDING',
      'REAPPLY',
      'REJECTED',
      'ENDED',
    ];

    return !appData || showFormStatuses.includes(appData.status);
  }, [appData]);

  // handle adopter confirmation
  const handleAdopterConfirmation = useCallback(
    async ({
      confirmation,
      reason,
    }: {
      confirmation: 'yes' | 'no';
      reason?: string;
    }) => {
      if (
        !(
          appData &&
          appData.matched_adoptee &&
          appData.monday_id &&
          appData.email
        )
      )
        return;

      const { error } = await handleAdopterConfirmationServer({
        accepted: confirmation === 'yes',
        adopterId: appData.adopter_uuid,
        email: appData.email,
        adopteeMondayId: appData.matched_adoptee,
        appId: appData.app_uuid,
        appMondayId: appData.monday_id,
        reason,
      });

      // TODO: use toast or error screen
      if (error) {
        alert(error);
      } else {
        // stretch TODO: use websockets instead for real time updates
        // refresh page with updated data
        router.push('/');
      }
    },
    [appData, router],
  );

  if (!(showPreview && previewId && appData?.time_submitted)) return null;

  // replace URL to / when modal closes
  const triggerNavigate = (open: boolean) => {
    if (open) return;
    router.replace(
      historyStatuses.includes(appData.status) ? '/?tab=history' : '/',
    );
  };

  return (
    <Dialog.Root open defaultOpen onOpenChange={triggerNavigate}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 grid h-full w-full place-items-center bg-black/50">
          <Dialog.Content className="flex h-[90svh] w-4/5 min-w-75 flex-col gap-2 overflow-hidden rounded-2xl bg-white">
            <header className="flex justify-center border border-gray-4 py-8 shadow-[0_2px_8px_#6e6e6e1c]">
              <section className="flex w-1/2 min-w-72 flex-col gap-2">
                <div className="flex items-center gap-4">
                  <Dialog.Title className="text-3xl">
                    {appData.status === 'ACTIVE' || appData.status === 'ENDED'
                      ? appData.adoptee_name
                      : `Application #${appData.app_num}`}
                  </Dialog.Title>
                  <StatusPill status={appData.status} />
                </div>
                <p className="text-gray-9">{timeText}</p>
              </section>
            </header>

            <main className="flex justify-center overflow-auto py-10">
              <section className="flex w-1/2 min-w-72 flex-col gap-5">
                <Dialog.Description className="hidden">
                  Details on application #{appData.app_num}
                </Dialog.Description>

                {/* status & msg */}
                <AppCallout app={appData} />

                {showAdopterFormValues && (
                  <AdopterApplicationFormValues appData={appData} />
                )}

                {/* ranking */}
                {showAdopterFormValues &&
                  !appData.matched &&
                  appData.adoptees && (
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-bold text-gray-9">
                        Adoptee Ranking
                      </p>
                      <ol>
                        {appData.adoptees.map((a, idx) => (
                          <li key={a.id}>
                            {idx + 1}. {a.first_name}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                {/* matched adoptee name */}
                {appData.matched && appData.adoptees && (
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-gray-9">
                      Adoptee Name
                    </p>
                    <p>{appData.adoptee_name}</p>
                  </div>
                )}

                {/* match confirmation controls */}
                {appData.matched &&
                  appData.status === 'PENDING_CONFIRMATION' && (
                    <ConfirmationControls
                      onSubmit={data => console.log(data)}
                    />
                  )}

                {/* active: end correspondence */}
                {appData.status === 'ACCEPTED' && (
                  <EndCorrespondenceControls
                    onSubmit={data => console.log(data)}
                  />
                )}
              </section>
            </main>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
