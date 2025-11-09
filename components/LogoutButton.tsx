import Image from 'next/image';
import LogOutImg from '@/assets/images/Log_Out.png';

export default function LogoutButton() {
  return (
    <div className="rounded-2xl bg-gray-4 px-4 pt-3 pb-2">
      <div className="flex flex-row items-center gap-3">
        <div className="h-7 w-7 rounded-full bg-gray-9" />
        <p className="font-golos text-lg">Ethan Tam</p>
        <Image src={LogOutImg} height={24} width={24} alt="Logout" priority />
      </div>
    </div>
  );
}

// px-4
// pt-4
// pb-2
