import Image from 'next/image';
import Logo from '@/assets/images/Adopt_An_Inmate_logo.png';
import { LogInCard } from '@/components/LoginCard';

export default function LoginPage() {
  return (
    <div className="h-full w-full bg-[#EDEBE9]">
      <div className="flex flex-col">
        <Image src={Logo} width={100} height={100} alt="Logo" />
        <div className="flex h-full w-full flex-col items-center justify-items-center">
          <LogInCard />
        </div>
      </div>
    </div>
  );
}
