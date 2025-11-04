import Image from 'next/image';
import LogoImg from '@/assets/images/Adopt_An_Inmate_logo.png';

export default function Logo() {
  return (
    <div className="flex flex-row items-center gap-6 pt-14">
      <Image src={LogoImg} height={42} alt="Logo" priority />
      <p className="font-golos text-xl font-extrabold text-red-9">
        {' '}
        Adopt an Inmate
      </p>
    </div>
  );
}
