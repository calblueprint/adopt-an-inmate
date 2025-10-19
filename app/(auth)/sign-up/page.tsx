import Logo from '@/components/login_signup_components/logo';
import { SignUpCard } from '@/components/login_signup_components/SignUpCard';

export default function SignUpPage() {
  return (
    // This is the background
    <div className="bg-gray2 h-full w-full">
      <div className="flex flex-col items-center gap-[97px]">
        <Logo />
        <div className="flex h-full w-full flex-col items-center justify-items-center">
          <SignUpCard />
        </div>
      </div>
    </div>
  );
}
