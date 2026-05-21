'use client';

import { useState } from 'react';
import AsyncButton from '@/components/AsyncButton';
import { Button } from '@/components/Button';
import { formatDate } from '@/lib/formatters';
import { ApplicationWithAdoptees } from '@/types/schema';
import { CalloutCard } from './AppCallout';
import { ApplicationDialogTabs } from './ApplicationPreviewDialog';

export default function ConfirmationControls({
  onAccept,
  setActiveTab,
  app,
}: {
  onAccept: () => Promise<void>;
  setActiveTab: React.Dispatch<React.SetStateAction<ApplicationDialogTabs>>;
  app: ApplicationWithAdoptees;
}) {
  const [accepted, setAccepted] = useState(false);

  const deadlineText = app?.appData.time_confirmation_due
    ? `You have until ${formatDate(app?.appData.time_confirmation_due)} to respond.`
    : 'You have two weeks to respond.';

  const handleAccept = async () => {
    await onAccept();
    setAccepted(true);
  };

  return accepted ? (
    <CalloutCard
      title={`${app?.appData.adoptee_name} is now officially your adoptee!`}
      description="Read more on what to do next below."
      status="ACTIVE"
    />
  ) : (
    <CalloutCard
      title={`You have been matched with ${app?.appData.adoptee_name}.`}
      description={`Do you confirm that you will communicate with your adoptee? ${deadlineText}`}
      status="PENDING"
    >
      <div className="mt-2 flex items-center gap-2 font-normal">
        <AsyncButton variant="primary" onClick={handleAccept}>
          Yes
        </AsyncButton>
        <Button variant="outline" onClick={() => setActiveTab('confirmation')}>
          No
        </Button>
      </div>
    </CalloutCard>
  );
}
