'use client';

import { useForm } from 'react-hook-form';
import { upsertApplication } from '@/actions/queries/query';
import { Button } from '@/components/Button';
import QuestionBack from '@/components/questions/QuestionBack';
import { TextArea } from '@/components/TextArea';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useAuth } from '@/contexts/AuthProvider';
import { useQuestionNavigaton } from '@/hooks/questions';

interface ReasonForm {
  reason?: string;
}

export default function MainQuestionReason() {
  const { appState, setAppState } = useApplicationContext();
  const { nextQuestion } = useQuestionNavigaton();
  const { userId } = useAuth();

  const devUserId = '297a39c3-a21f-4ec7-86e1-cc3c003cda26'; //delete

  const { register, handleSubmit } = useForm<ReasonForm>({
    defaultValues: {
      reason: appState.stillInCorrespondence
        ? appState.form.whyAdopting
        : appState.form.whyEnded,
    },
  });

  const onSubmit = async ({ reason }: ReasonForm) => {
    if (appState.stillInCorrespondence)
      setAppState(prev => ({
        ...prev,
        form: { ...prev.form, whyAdopting: reason },
      }));
    else
      setAppState(prev => ({
        ...prev,
        form: { ...prev.form, whyEnded: reason },
      }));

    try {
      await upsertApplication({
        adopter_uuid: devUserId ?? userId!,
        app_uuid: appState.appId,
        return_explanation: reason,
      });
    } catch (error) {
      console.error('Failed to save application:', error);
    }

    nextQuestion();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <header className="flex flex-col gap-2">
        <h1>
          {appState.stillInCorrespondence
            ? 'Why are you adopting another adoptee?'
            : 'Why did your previous correspondence end?'}
        </h1>
      </header>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="reason" className="text-sm text-gray-11">
            {appState.stillInCorrespondence
              ? 'Reason for adopting'
              : 'Why it ended'}{' '}
            (optional)
          </label>
          <TextArea id="reason" {...register('reason', { required: false })} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <QuestionBack />
        <Button variant="primary" type="submit">
          Next
        </Button>
      </div>
    </form>
  );
}
