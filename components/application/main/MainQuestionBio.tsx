'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { TextArea } from '@/components/TextArea';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useApplicationNavigation } from '@/hooks/app-process';
import { useQuestionNavigaton } from '@/hooks/questions';

interface BioForm {
  bio: string;
}

export default function MainQuestionBio() {
  const { appState, setAppState } = useApplicationContext();
  const { nextQuestion } = useQuestionNavigaton();
  const { upsertAppInfo } = useApplicationNavigation();

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
    upsertAppInfo({ personal_bio: bio }); //new upsert helper
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
