import Image from 'next/image';
import CustomLink from '@/components/CustomLink';
import { LogInCard } from '@/components/LoginCard';

// import Logo from "";

export default function SignUpPage() {
  return (
    <div className="h-full w-full bg-[#EDEBE9]">
      <div className="flex flex-col">
        <Image
          src={'/../../assets/images/Adopt_An_Inmate_logo.png'}
          width={100}
          height={100}
          alt="Logo"
        />
        <div className="flex h-full w-full flex-col items-center justify-items-center">
          <LogInCard />
        </div>
      </div>
    </div>
  );
}
