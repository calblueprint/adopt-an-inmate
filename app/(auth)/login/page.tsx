import { LoginCard } from '@/components/auth/LoginCard';
import Logo from '@/components/Logo';

export default function LoginPage() {
  return (
    <div className="flex size-full flex-col items-center">
      <Logo />

      <div className="flex h-full w-full flex-col items-center justify-center">
        <LoginCard />
      </div>

      {/* spacer */}
      <div className="h-24" />
    </div>
  );
}
