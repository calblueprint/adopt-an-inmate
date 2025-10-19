import { LoginCard } from '@/components/login_signup_components/LoginCard';
import Logo from '@/components/login_signup_components/logo';

export default function LoginPage() {
  return (
    <div className="h-full w-full bg-[#EDEBE9]">
      <Logo />

      <div className="flex h-full w-full flex-col items-center justify-items-center">
        <LoginCard />
      </div>
    </div>
  );
}
