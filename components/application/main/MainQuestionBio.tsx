'use client';

import { useForm } from 'react-hook-form';
import { upsertApplication } from '@/actions/queries/query';
import { Button } from '@/components/Button';
import { TextArea } from '@/components/TextArea';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useAuth } from '@/contexts/AuthProvider';
import { useQuestionNavigaton } from '@/hooks/questions';

//import { uuidv4, z } from 'zod/';

interface BioForm {
  bio: string;
}

export default function MainQuestionBio() {
  const { appState, setAppState } = useApplicationContext();
  const { nextQuestion } = useQuestionNavigaton();
  const { userId } = useAuth(); //NOTE: disable RLS to test, then renable ig

  const devUserId = '297a39c3-a21f-4ec7-86e1-cc3c003cda26'; //delete
  const devAppId = 'ce554661-540f-4ad4-a2d5-7f8002f50108'; //delete

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BioForm>({
    defaultValues: {
      bio: appState.form.bio,
    },
  });

  const onSubmit = async ({ bio }: BioForm) => {
    setAppState(prev => ({ ...prev, form: { ...prev.form, bio } }));

    try {
      // TODO: move this "new application" button, so gen app id when press that instead
      // compute new app_uuid if missing
      const genAppId =
        !appState.appId || appState.appId === 'appId'
          ? devAppId //z.string().parse(uuidv4())
          : appState.appId;

      setAppState(prev => ({ ...prev, appId: genAppId }));

      // since first question, set initial default for irrelevant cols
      await upsertApplication({
        adopter_uuid: devUserId ?? userId!,
        app_uuid: genAppId, //should we do useEffect mayhaps
        personal_bio: bio,
        ranked_cards: null,
        status: 'incomplete',
        //time_submitted: '', //should this be nullable?
      });
    } catch (error) {
      console.error('Failed to save application:', error);
    }

    nextQuestion();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1">
        <header className="flex flex-col gap-2">
          <h1>
            What is your story? <sup className="text-red-600">*</sup>{' '}
          </h1>
        </header>
        <div className="flex justify-between text-sm">
          <span className={`${errors.bio ? 'text-red-600' : 'text-gray-500'}`}>
            {errors.bio?.message}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="bio" className="text-sm text-gray-11">
            Personal bio
          </label>
          <TextArea
            id="bio"
            {...register('bio', {
              required: true,
              minLength: {
                value: 300,
                message: 'Must be at least 300 characters',
              },
            })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div />
        <Button variant="primary" type="submit">
          Next
        </Button>
      </div>
    </form>
  );
}
