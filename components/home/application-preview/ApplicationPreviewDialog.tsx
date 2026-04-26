'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { LuChevronLeft, LuX } from 'react-icons/lu';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dialog, Tabs, VisuallyHidden } from 'radix-ui';
import { getApplicationWithAdoptees } from '@/actions/applications/getApplicationWithAdoptees';
import { handleAdopterConfirmation as handleAdopterConfirmationServer } from '@/actions/applications/handleAdopterConfirmation';
import Logger from '@/actions/logging';
import { Button } from '@/components/Button';
import {
  formatAgePreference,
  formatAppDateByStatus,
  formatGenderPreference,
} from '@/lib/formatters';
import { calculateAge } from '@/lib/utils';
import { ApplicationWithAdoptees } from '@/types/schema';
import AdopteeInfoOverview from './AdopteeInfoOverview';
import AppCallout from './AppCallout';
import ConfirmationControls from './ConfirmationControls';
import EndCorrespondenceForm from './EndCorrespondenceForm';
import RankingCardPreview from './RankingCardPreview';
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
  const [activeTab, setActiveTab] = useState<'main' | 'end-correspondence'>(
    'main',
  );
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

  // app controls
  const showAdopterFormValues = useMemo(() => {
    if (!appData) return false;
    return !appData.matched_adoptee;
  }, [appData]);

  const showAdopteeInfo = useMemo(() => {
    if (!appData) return false;
    return !!appData.matched_adoptee;
  }, [appData]);

  const showMailingInfo = useMemo(() => {
    if (!appData) return false;
    return !!appData.matched_adoptee && appData.status !== 'ENDED';
  }, [appData]);

  if (!(showPreview && previewId && appData?.time_submitted)) return null;

  // replace URL to / when modal closes
  const triggerNavigate = (open: boolean) => {
    if (open) return;
    setAppData(null);
    router.replace(
      historyStatuses.includes(appData.status) ? '/?tab=history' : '/',
    );
  };

  return (
    <Dialog.Root open defaultOpen onOpenChange={triggerNavigate}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 grid h-full w-full place-items-center bg-black/50">
          <Dialog.Content className="flex h-[90svh] w-4/5 min-w-80 flex-col overflow-hidden rounded-2xl bg-white">
            <header className="relative flex justify-center border border-gray-4 py-8 shadow-[0_2px_8px_#6e6e6e1c]">
              <section className="flex w-1/2 min-w-75 flex-col gap-2">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <Dialog.Title className="text-3xl">
                    {appData.adoptee_name || `Application #${appData.app_num}`}
                  </Dialog.Title>
                  <StatusPill status={appData.status} />
                </div>
                <p className="text-gray-9">{timeText}</p>
              </section>

              <Dialog.Close asChild>
                <button className="absolute top-8 right-9 cursor-pointer rounded-full bg-gray-4 p-2 transition-colors hover:bg-gray-5">
                  <LuX />
                </button>
              </Dialog.Close>
            </header>

            <main className="flex h-full justify-center overflow-auto py-8">
              <section className="w-1/2 min-w-72">
                <Tabs.Root value={activeTab}>
                  <Tabs.Content
                    value="main"
                    className="flex h-full w-full flex-col gap-5"
                  >
                    {/* accessibility descripion, announced when dialog opens */}
                    <VisuallyHidden.Root asChild>
                      <Dialog.Description>
                        Details on application #{appData.app_num}
                      </Dialog.Description>
                    </VisuallyHidden.Root>

                    {/* status & msg */}
                    <AppCallout app={appData} />

                    {/* rankings */}
                    {showAdopterFormValues &&
                      !appData.matched &&
                      appData.adoptees && (
                        <div className="flex flex-col gap-3">
                          <p className="text-sm font-medium text-gray-10">
                            RANKINGS
                          </p>
                          <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-2">
                            {appData.adoptees.map((a, idx) => (
                              <RankingCardPreview
                                key={a.id}
                                idx={idx}
                                age={a.dob ? calculateAge(a.dob) : 'N/A'}
                                firstName={a.first_name}
                                gender={a.gender}
                                state={a.state}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                    {/* adopter bio */}
                    <div className="flex flex-col gap-3">
                      <p className="text-sm font-medium text-gray-10">
                        BIOGRAPHY
                      </p>
                      <p>{appData.personal_bio}</p>
                    </div>

                    {/* preferences */}
                    {showAdopterFormValues && (
                      <>
                        {/* gender preference */}
                        <div className="flex flex-col gap-3">
                          <p className="text-sm font-medium text-gray-10">
                            GENDER PREFERENCE
                          </p>
                          <p>{formatGenderPreference(appData.gender_pref)}</p>
                        </div>

                        {/* age preference */}
                        <div className="flex flex-col gap-3">
                          <p className="text-sm font-medium text-gray-10">
                            AGE PREFERENCE
                          </p>
                          <p>{formatAgePreference(appData.age_pref)}</p>
                        </div>
                      </>
                    )}

                    {/* adoptee info */}
                    {showAdopteeInfo && (
                      <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium text-gray-10">
                          ADOPTEE INFORMATION
                        </p>
                        <AdopteeInfoOverview appData={appData} />
                      </div>
                    )}

                    {/* mailing info */}
                    {showMailingInfo && (
                      <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium text-gray-10">
                          MAILING INFORMATION
                        </p>
                        <div className="rounded-2xl bg-gray-3 p-6">
                          {/* TODO: populate with mailing info */}
                        </div>
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
                    {appData.status === 'ACTIVE' && (
                      <div>
                        <Button
                          variant="quaternary"
                          onClick={() => setActiveTab('end-correspondence')}
                        >
                          End Connection
                        </Button>
                      </div>
                    )}
                  </Tabs.Content>

                  {/* end correspondence form */}
                  {appData.status === 'ACTIVE' && (
                    <Tabs.Content
                      value="end-correspondence"
                      className="flex h-full w-full flex-col gap-2"
                    >
                      <div className="relative">
                        <div className="absolute top-1/2 -left-4 -translate-x-full -translate-y-1/2">
                          <Button
                            variant="ghost"
                            onClick={() => setActiveTab('main')}
                          >
                            <LuChevronLeft />
                          </Button>
                        </div>

                        <h2>End Connection</h2>
                      </div>
                      <p className="text-gray-12/60">
                        This will end the correspondence with{' '}
                        {appData.adoptee_name} permanently. This action cannot
                        be reversed.
                      </p>
                      <EndCorrespondenceForm
                        onSubmit={data => console.log(data)}
                      >
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab('main')}
                        >
                          Cancel
                        </Button>
                      </EndCorrespondenceForm>
                    </Tabs.Content>
                  )}
                </Tabs.Root>

                {/* padding */}
                <div className="pb-8" />
              </section>
            </main>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
