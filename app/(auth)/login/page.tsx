import { LoginCard } from '@/components/auth/LoginCard';
import Logo from '@/components/Logo';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center gap-36">
      <Logo />

      <div className="flex h-full w-full flex-col items-center justify-items-center">
        <LoginCard />
      </div>
    </div>
  );
}
