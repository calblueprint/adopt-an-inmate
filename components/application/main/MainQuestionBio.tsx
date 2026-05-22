'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { TextArea } from '@/components/TextArea';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useAppProcess } from '@/hooks/app-process';
import { useQuestionNavigaton } from '@/hooks/questions';

interface BioForm {
  bio: string;
}

export default function MainQuestionBio() {
  const { appState, setAppState } = useApplicationContext();
  const { nextQuestion } = useQuestionNavigaton();
  const { upsertAppInfo } = useAppProcess();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BioForm>({
    defaultValues: {
      bio: appState.form.bio,
    },
  });

  const bioValue = watch('bio', '');

  const onSubmit = async ({ bio }: BioForm) => {
    setAppState(prev => ({ ...prev, form: { ...prev.form, bio } }));
    upsertAppInfo({ personal_bio: bio });
    nextQuestion();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1">
        <header className="flex flex-col gap-2">
          <h1>Enter your bio</h1>

          <label htmlFor="bio" className="text-sm text-gray-11">
            This information will be used for matching you with adoptees.
            Minimum 350 characters, maximum 750 characters.
          </label>
        </header>

        <div className="flex items-center justify-between text-sm">
          <span className={errors.bio ? 'text-red-600' : 'text-gray-500'}>
            {errors.bio?.message}
          </span>
        </div>
      </div>

      <div className="mb-[10vh] flex flex-col gap-4">
        <div className="flex flex-col">
          <TextArea
            id="bio"
            placeholder="Ex. I love eating food, traveling, lorem ipsum..."
            {...register('bio', {
              required: 'Bio is required',
              minLength: {
                value: 350,
                message: 'Must be at least 350 characters',
              },
              maxLength: {
                value: 750,
                message: 'Must be 750 characters or less',
              },
            })}
          />
          <span className="text-[10px] font-normal text-gray-11">
            {bioValue.length}/750 characters
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div />

        <Button variant="quaternary" type="submit">
          Next
        </Button>
      </div>
    </form>
  );
}
