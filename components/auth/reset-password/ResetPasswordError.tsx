import { ButtonLink } from '@/components/Button';

export default function ResetPasswordError() {
  return (
    <div className="flex w-106 flex-col gap-2 rounded-2xl bg-gray-1 p-8">
      <p className="text-3xl font-medium">Uh oh.</p>

      <p className="text-gray-11">
        We encountered an unexpected error on our side. If this issue persists,
        please contact us via email. Sorry for the inconvenience!
      </p>

      <ButtonLink href="/forgot-password" variant="login" className="mt-2">
        Try again
      </ButtonLink>
    </div>
  );
}
