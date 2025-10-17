import Image from 'next/image';
import Logo from '@/assets/images/Adopt_An_Inmate_logo.png';
import { LogInCard } from '@/components/LoginCard';

export default function LoginPage() {
  return (
    <div className="h-full w-full bg-[#EDEBE9]">
      <div className="flex flex-col items-center gap-[143px]">
        <div className="flex flex-row items-center gap-6 pt-14">
          <Image src={Logo} width={53} height={42} alt="Logo" />
          <p className="font-golos text-xl font-extrabold text-[#AF2028]">
            {' '}
            Adopt an Inmate
          </p>
        </div>

        <div className="flex h-full w-full flex-col items-center justify-items-center">
          <LogInCard />
        </div>
      </div>
    </div>
  );
}
