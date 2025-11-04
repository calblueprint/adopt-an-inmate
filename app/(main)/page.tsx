'use client';

import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import CustomLink from '@/components/CustomLink';
import ConfirmationDialog from '@/components/home/ConfirmationDialog';
import { Textbox } from '@/components/Textbox';

type FormInputs = {
  bio: string;
};

export default function ApplicationsPage() {
  const [, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async data => {
    setIsLoading(true);
    try {
      const response = await fetch('api/embed_and_fetch.py', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: data.bio }),
      });
      const responseClone = response.clone();
      const resultText = await responseClone.text();
      if (resultText.includes('error')) {
        throw new Error(`Server returned an error: ${resultText}`);
      }
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate embedding');
      }
      console.log('Generated Embedding:', result.embedding);
      console.log('Similar bios:', result.similar_bios);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* shows up only when search param confirmation=true */}
      <ConfirmationDialog />

      {/* application page */}
      <main className="flex h-full w-full flex-col items-center justify-center">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
          <Textbox
            type="text"
            placeholder="enter bio"
            {...register('bio', { required: 'Bio is required' })}
            error={errors.bio?.message}
          />

          <Button variant="primary" className="mt-7 w-full" type="submit">
            Enter
          </Button>
        </form>

        <p>Applications page</p>
        <CustomLink href="/app/1234567890">Sample app</CustomLink>
        <CustomLink href="/sign-up">Sign up</CustomLink>
        <CustomLink href="/login">Login</CustomLink>
        <CustomLink href="/onboarding">Onboarding</CustomLink>
        <CustomLink href="/profile">Profile</CustomLink>
      </main>
    </>
  );
}
