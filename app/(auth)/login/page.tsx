import Image from 'next/image';
import logo from '@/assets/images/Adopt_An_Inmate_logo_even_better.png';
import { LogInCard } from '@/components/LoginCard';

// import Logo from "";

export default function SignUpPage() {
  return (
    <div className="h-full w-full bg-[#EDEBE9]">
      <div className="flex flex-col items-center gap-[143px]">
        <Image
          src={logo}
          width={53.981}
          height={42.055}
          alt="Logo"
          className="mt-[38px]"
        />
        <div className="flex h-full w-full flex-col items-center justify-items-center">
          <LogInCard />
        </div>
      </div>
    </div>
  );
}
