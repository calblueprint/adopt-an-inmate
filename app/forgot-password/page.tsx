import ForgotPasswordFlowDecider from '@/components/auth/forgot-password/ForgotPasswordFlowDecider';
import Logo from '@/components/Logo';
import { ForgotPasswordContextProvider } from '@/contexts/ForgotPasswordContext';

export default function ForgotPasswordPage() {
  // TODO: add context to share email context between check email and forgot password
  // TODO: add "resend email" functionality for check email

  return (
    <div className="flex size-full flex-col items-center gap-4">
      <Logo />

      <div className="flex size-full flex-col items-center justify-center">
        <ForgotPasswordContextProvider>
          <ForgotPasswordFlowDecider />
        </ForgotPasswordContextProvider>
      </div>

      {/* spacer */}
      <div className="h-22" />
    </div>
  );
}
