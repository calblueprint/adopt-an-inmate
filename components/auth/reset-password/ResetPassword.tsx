'use client';

import { Resolver, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Logger from '@/actions/logging';
import CustomLink from '@/components/CustomLink';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { Button } from '../../Button';
import { Textbox } from '../../Textbox';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const resolver: Resolver<ResetPasswordForm> = async values => {
  return {
    values: values.password !== values.confirmPassword ? {} : values,
    errors:
      values.password !== values.confirmPassword
        ? {
            confirmPassword: {
              type: 'pattern',
              message: 'Passwords do not match',
            },
          }
        : {},
  };
};

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordForm>({ resolver });

  const router = useRouter();

  const onSubmit = async ({ password }: ResetPasswordForm) => {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.updateUser({ password });

    // error: same password
    if (error && error.code === 'same_password') {
      setError('confirmPassword', {
        type: 'validate',
        message: 'Password should be different from old password',
      });
      return;
    }

    // success: redirect to success page + log out
    if (data) {
      // we call sign out to sign out of all sessions (default scope is global)
      // this ensures future logins are only made by users who know the password (i.e. the user)
      await supabase.auth.signOut();
      router.push('?status=success');
    }

    // error: redirect to error page
    if (error) {
      Logger.error(
        `Error occurred while calling updateUser (reset password): ${error.message}`,
      );
      router.push('?status=error');
    }
  };

  return (
    <form
      className="flex w-106 flex-col gap-7 rounded-2xl bg-gray-1 p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <p className="text-3xl font-medium">Reset password</p>
        <p className="text-gray-9">
          Remembered your password?{' '}
          <CustomLink href="/login" className="text-link">
            Return to applications.
          </CustomLink>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="space-y-6">
          <div className="flex flex-col">
            <p className="text-gray-9">Password</p>
            <Textbox
              type="password"
              placeholder="Password"
              {...register('password')}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-gray-9">Confirm password</p>
            <Textbox
              type="password"
              placeholder="Confirm password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword?.message && (
              <p className="text-right text-error">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
        <Button variant="login" type="submit" className="mt-7">
          Reset password
        </Button>
      </div>
    </form>
  );
}
