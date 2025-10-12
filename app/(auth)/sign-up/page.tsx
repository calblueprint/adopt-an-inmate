'use client';

import Image from 'next/image';
import Logo from '@/assets/images/Adopt_An_Inmate_logo_even_better.png';
import { SignUpCard } from '@/components/SignUpCard';

export default function SignUpPage() {
  return (
    // This is the background
    <div className="h-full w-full bg-[#EDEBE9]">
      <div className="flex flex-col items-center gap-[97px]">
        <Image src={Logo} width={53.981} height={42.055} alt="Logo" />
        <div className="flex h-full w-full flex-col items-center justify-items-center">
          <SignUpCard />
        </div>
      </div>
    </div>
  );
}
