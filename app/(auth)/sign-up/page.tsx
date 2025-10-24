import { SignUpCard } from '@/components/auth/SignUpCard';
import Logo from '@/components/Logo';

export default function SignUpPage() {
  return (
    <div className="flex size-full flex-col items-center gap-4">
      <Logo />

      <div className="flex h-full w-full flex-col items-center justify-center">
        <SignUpCard />
      </div>

      {/* spacer */}
      <div className="h-22" />
    </div>
  );
}
