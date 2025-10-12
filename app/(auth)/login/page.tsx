import CustomLink from '@/components/CustomLink';
import { LogInCard } from '@/components/LoginCard';

import Image from "next/image";
// import Logo from "";

export default function SignUpPage() {
  return (
    <div className="w-full h-full bg-[#EDEBE9]">
      <div className="flex flex-col">
            <Image src={"/../../assets/images/Adopt_An_Inmate_logo.png"} width={100} height={100} alt="Logo" />
            <div className="flex h-full w-full flex-col items-center justify-items-center">
              <CustomLink href="/">← Back to Home</CustomLink>
            
              <LogInCard/>
            </div>
      </div>
    </div>  
  );
}
