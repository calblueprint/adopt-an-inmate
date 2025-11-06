'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import QuestionBack from '@/components/questions/QuestionBack';
import { TextArea } from '@/components/TextArea';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useQuestionNavigaton } from '@/hooks/questions';

interface BioForm {
  bio: string;
}

export default function MainQuestionBio() {
  const { appState, setAppState } = useApplicationContext();
  const { nextQuestion } = useQuestionNavigaton();

  const { register, handleSubmit } = useForm<BioForm>({
    defaultValues: {
      bio: appState.form.bio,
    },
  });

  const onSubmit = ({ bio }: BioForm) => {
    setAppState(prev => ({ ...prev, form: { ...prev.form, bio } }));
    nextQuestion();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <header className="flex flex-col gap-2">
        <h1>What is your story?</h1>
      </header>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="bio" className="text-sm text-gray-11">
            Personal Bio
          </label>
          <TextArea id="bio" {...register('bio', { required: true })} />
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
