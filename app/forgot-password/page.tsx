import Link from 'next/link';
import ForgotPasswordFlowDecider from '@/components/auth/forgot-password/ForgotPasswordFlowDecider';
import Logo from '@/components/Logo';

export default function ForgotPasswordPage() {
  return (
    <div className="flex size-full flex-col items-center gap-4">
      <Link href="/">
        <Logo />
      </Link>

      <div className="flex size-full flex-col items-center justify-center">
        <ForgotPasswordFlowDecider />
      </div>

      {/* spacer */}
      <div className="h-22" />
    </div>
  );
}
