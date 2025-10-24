import { SignUpCard } from '@/components/auth/SignUpCard';
import Logo from '@/components/Logo';

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center gap-36">
      <Logo />

      <div className="flex h-full w-full flex-col items-center justify-items-center">
        <SignUpCard />
      </div>
    </div>
  );
}
