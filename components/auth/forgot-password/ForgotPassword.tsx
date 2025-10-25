'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Logger from '@/actions/logging';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { Button } from '../../Button';
import { Textbox } from '../../Textbox';

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm<ForgotPasswordForm>();

  const router = useRouter();

  const onSubmit = ({ email }: ForgotPasswordForm) => {
    const sendResetEmail = async () => {
      const supabase = getSupabaseBrowserClient();

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/reset-password',
      });

      if (error) {
        Logger.error(
          `An error occurred while sending reset password email: ${error.message}`,
        );
        router.push('?status=error');
      } else {
        router.push('?status=check-email');
      }
    };

    sendResetEmail();
  };

  return (
    <form
      className="flex w-106 flex-col gap-7 rounded-2xl bg-gray-1 p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="text-3xl font-medium">Forgot password?</p>

      <div className="flex flex-col">
        <div className="flex flex-col">
          <p className="text-base text-gray-9">Email</p>
          <Textbox
            type="email"
            placeholder="jamie@example.com"
            {...register('email')}
          />
        </div>
        <Button variant="login" type="submit" className="mt-7">
          Reset password
        </Button>
      </div>
    </form>
  );
}
