import Logo from '@/components/login_signup_components/Logo';
import { SignUpCard } from '@/components/login_signup_components/SignUpCard';

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
