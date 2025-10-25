import { ButtonLink } from '@/components/Button';

export default function ResetPasswordSuccess() {
  return (
    <div className="flex w-106 flex-col gap-2 rounded-2xl bg-gray-1 p-8">
      <p className="text-3xl font-medium">Success!</p>

      <p className="text-gray-11">Your password has been successfully reset.</p>

      <ButtonLink href="/login" variant="login" className="mt-2">
        Go to Login
      </ButtonLink>
    </div>
  );
}
