'use client';

import type { EndReasonOption } from '@/data/endCorrespondenceDropdown';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LuHouse, LuMapPin, LuX } from 'react-icons/lu';
import { PiCity } from 'react-icons/pi';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dialog, Tabs, VisuallyHidden } from 'radix-ui';
import { getApplicationWithAdoptees } from '@/actions/applications/getApplicationWithAdoptees';
import { handleAdopterConfirmation as handleAdopterConfirmationServer } from '@/actions/applications/handleAdopterConfirmation';
import { handleEndCorrespondence as handleEndCorrespondenceServer } from '@/actions/applications/handleEndCorrespondence';
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
import DialogExtraForm from './DialogExtraForm';
import EndCorrespondenceForm from './EndCorrespondenceForm';
import RankingCardPreview from './RankingCardPreview';
import RejectConfirmationForm from './RejectConfirmationForm';
import StatusPill from './StatusPill';

export type ApplicationDialogTabs =
  | 'main'
  | 'end-correspondence'
  | 'confirmation';

export default function ApplicationPreviewDialog() {
  const searchParams = useSearchParams();
  const showPreview = useMemo(
    () => searchParams.get('dialog') === 'preview',
    [searchParams],
  );
  const previewId = useMemo(() => searchParams.get('preview'), [searchParams]);
  const router = useRouter();
  const [data, setData] = useState<ApplicationWithAdoptees>(null);
  const [activeTab, setActiveTab] = useState<ApplicationDialogTabs>('main');
  const historyStatuses = ['REAPPLY', 'REJECTED', 'ENDED'];

  useEffect(() => {
    if (!previewId) return;

    // fetch application data
    const fetchData = async () => {
      const { data, error } = await getApplicationWithAdoptees(previewId);

      if (error) {
        console.log(
          `Error fetching preview for application ID ${previewId}: ${error}`,
        );
        return;
      }

      if (!data) {
        Logger.error(`No such application ${previewId}`);
        return;
      }

      setData(data);
    };

    fetchData();
  }, [previewId]);

  const timeText = useMemo(() => {
    if (!data) return '';
    return formatAppDateByStatus(data.appData);
  }, [data]);

  // handle adopter confirmation
  const handleAdopterConfirmation = useCallback(
    async (confirmation: boolean, reason?: string) => {
      if (
        !(
          data &&
          data.appData &&
          data.appData.matched_adoptee &&
          data.appData.monday_id &&
          data.email
        )
      )
        return;

      const { error } = await handleAdopterConfirmationServer({
        accepted: confirmation,
        adopterId: data.appData.adopter_uuid,
        email: data.email,
        adopteeMondayId: data.appData.matched_adoptee,
        appId: data.appData.app_uuid,
        appMondayId: data.appData.monday_id,
        reason,
      });

      // TODO: use toast or error screen
      if (error) {
        alert(error);
      } else {
        window.location.href = '/';
      }
    },
    [data],
  );

  // handle end correspondence
  const handleEndCorrespondence = useCallback(
    async (reason: EndReasonOption) => {
      if (!(data && data.email && data.matched)) return;

      const { error } = await handleEndCorrespondenceServer({
        appId: data.appData.app_uuid,
        adopterEmail: data.email,
        adopterId: data.appData.adopter_uuid,
        adopteeId: data.matchedAdoptee.id,
        adopteeInmateId: data.matchedAdoptee.inmate_id,
        reason,
      });

      if (error) {
        // TODO: replace with toast
        alert(error);
      } else {
        window.location.href = '/';
      }
    },
    [data],
  );

  // app controls
  const showMailingInfo = useMemo(() => {
    if (!data) return false;
    return data.appData.status === 'ACTIVE';
  }, [data]);

  if (!(showPreview && previewId && data?.appData.time_submitted)) return null;

  // replace URL to / when modal closes
  const triggerNavigate = (open: boolean) => {
    if (open) return;

    // reset states and data
    setData(null);
    setActiveTab('main');

    router.replace(
      historyStatuses.includes(data.appData.status) ? '/?tab=history' : '/',
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
                    {data.appData.adoptee_name ||
                      `Application #${data.appData.app_num}`}
                  </Dialog.Title>
                  <StatusPill status={data.appData.status} />
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
                        Details on application #{data.appData.app_num}
                      </Dialog.Description>
                    </VisuallyHidden.Root>

                    {data.appData.status === 'PENDING_CONFIRMATION' ? (
                      <ConfirmationControls
                        onAccept={async () =>
                          await handleAdopterConfirmation(true)
                        }
                        setActiveTab={setActiveTab}
                        app={data}
                      />
                    ) : null}

                    {/* status & msg */}
                    <AppCallout app={data.appData} />

                    {/* rankings */}
                    {!data.matched && data.adoptees && (
                      <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium text-gray-10">
                          RANKINGS
                        </p>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-2">
                          {data.adoptees.map((a, idx) => (
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
                        {data.matched
                          ? 'ADOPTEE BIOGRAPHY'
                          : 'PERSONAL BIOGRAPHY'}
                      </p>
                      <p>
                        {data.matched
                          ? data.matchedAdoptee.personal_bio
                          : data.appData.personal_bio}
                      </p>
                    </div>

                    {/* preferences */}
                    {!data.matched && (
                      <>
                        {/* gender preference */}
                        <div className="flex flex-col gap-3">
                          <p className="text-sm font-medium text-gray-10">
                            GENDER PREFERENCE
                          </p>
                          <p>
                            {formatGenderPreference(data.appData.gender_pref)}
                          </p>
                        </div>

                        {/* age preference */}
                        <div className="flex flex-col gap-3">
                          <p className="text-sm font-medium text-gray-10">
                            AGE PREFERENCE
                          </p>
                          <p>{formatAgePreference(data.appData.age_pref)}</p>
                        </div>
                      </>
                    )}

                    {/* adoptee info */}
                    {data.matched && (
                      <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium text-gray-10">
                          ADOPTEE INFORMATION
                        </p>
                        <AdopteeInfoOverview appData={data} />
                      </div>
                    )}

                    {/* mailing info */}
                    {showMailingInfo && (
                      <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium text-gray-10">
                          MAILING INFORMATION
                        </p>
                        <div className="flex flex-col gap-4 rounded-2xl bg-gray-3 p-6 font-medium">
                          {/* facility name */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <LuHouse />
                              <p>Facility</p>
                            </div>
                            <p className="text-black/60">
                              {data.matched
                                ? data.matchedAdoptee.facility_name
                                : 'N/A'}
                            </p>
                          </div>

                          {/* facility address */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <PiCity />
                              <p>System</p>
                            </div>
                            <p className="text-black/60">
                              {data.matched
                                ? data.matchedAdoptee.system
                                : 'N/A'}
                            </p>
                          </div>

                          {/* facility address */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <LuMapPin />
                              <p>Address</p>
                            </div>
                            <p className="text-black/60">
                              {data.matched
                                ? data.matchedAdoptee.mailing_address
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* active: end correspondence */}
                    {data.appData.status === 'ACTIVE' && (
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

                  {/* adopter confirmation form */}
                  {data.appData.status === 'PENDING_CONFIRMATION' && (
                    <DialogExtraForm
                      value="confirmation"
                      title="Reject Connection"
                      description={`This will reject the connection with ${data.appData.adoptee_name} permanently. This action cannot be reversed.`}
                      setActiveTab={setActiveTab}
                    >
                      <RejectConfirmationForm
                        onSubmit={async ({ reason }) =>
                          await handleAdopterConfirmation(false, reason)
                        }
                      />
                    </DialogExtraForm>
                  )}

                  {/* end correspondence form */}
                  {data.appData.status === 'ACTIVE' && (
                    <DialogExtraForm
                      value="end-correspondence"
                      title="End Connection"
                      description={`This will end the correspondence with ${data.appData.adoptee_name} permanently. This action cannot be reversed.`}
                      setActiveTab={setActiveTab}
                    >
                      <EndCorrespondenceForm
                        onSubmit={async ({ reason }) =>
                          await handleEndCorrespondence(reason)
                        }
                        setActiveTab={setActiveTab}
                      />
                    </DialogExtraForm>
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
