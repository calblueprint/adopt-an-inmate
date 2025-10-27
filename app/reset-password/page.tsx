import Link from 'next/link';
import ResetPasswordFlowDecider from '@/components/auth/reset-password/ResetPasswordFlowDecider';
import Logo from '@/components/Logo';

export default function ResetPasswordPage() {
  return (
    <div className="flex size-full flex-col items-center gap-4">
      <Link href="/">
        <Logo />
      </Link>

      <div className="flex size-full flex-col items-center justify-center">
        <ResetPasswordFlowDecider />
      </div>

      {/* spacer */}
      <div className="h-22" />
    </div>
  );
}
