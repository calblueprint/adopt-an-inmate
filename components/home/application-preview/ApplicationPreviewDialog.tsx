'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dialog } from 'radix-ui';
import { getApplicationWithAdoptees } from '@/actions/applications/getApplicationWithAdoptees';
import { handleAdopterConfirmation as handleAdopterConfirmationServer } from '@/actions/applications/handleAdopterConfirmation';
import Logger from '@/actions/logging';
import {
  formatAmericanTime,
  formatDate,
  formatEndedMessage,
} from '@/lib/formatters';
import { AdopterApplication, ApplicationWithAdoptees } from '@/types/schema';
import { AdopterApplicationFormValues } from './AdopterApplicationFormValues';
import ConfirmationControls, {
  ConfirmationFormValues,
} from './ConfirmationControls';
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

  // determine app status/step
  const statusText = useMemo(() => {
    if (!appData) return '';

    switch (appData.status) {
      case 'PENDING':
        return 'We are still reviewing your application!';
      case 'PENDING_CONFIRMATION':
        return "You've been matched! Confirm to accept below.";
      case 'REAPPLY':
        return appData.matched
          ? "We didn't receive confirmation in time, please reapply."
          : 'We found an issue with your application, please reapply.';
      case 'REJECTED':
        return 'You are blocked from creating future applications. Contact us to fix this.';
      case 'ENDED':
        return formatEndedMessage(appData.time_ended, appData.ended_reason);
      default:
        return '';
    }
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
    async ({ confirmation, reason }: ConfirmationFormValues) => {
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
          <Dialog.Content className="flex w-2/5 min-w-75 flex-col gap-2 rounded-lg bg-white p-10">
            <Dialog.Title className="text-3xl">
              {formatAmericanTime(appData.time_created)} Application
            </Dialog.Title>

            <main className="flex flex-col gap-6">
              <Dialog.Description>
                Submitted: {formatDate(appData.time_submitted)}
              </Dialog.Description>

              {/* status & msg */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <StatusPill status={appData.status} />
                <p className="font-bold text-gray-11 italic">{statusText}</p>
              </div>

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
                  <p className="text-sm font-bold text-gray-9">Adoptee Name</p>
                  <p>{appData.adoptees[0].first_name}</p>
                </div>
              )}

              {/* match confirmation controls */}
              {appData.matched && appData.status === 'PENDING_CONFIRMATION' && (
                <ConfirmationControls onSubmit={handleAdopterConfirmation} />
              )}

              {/* active: end correspondence */}
              {appData.status === 'ACCEPTED' && (
                <EndCorrespondenceControls
                  onSubmit={data => console.log(data)}
                />
              )}
            </main>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
