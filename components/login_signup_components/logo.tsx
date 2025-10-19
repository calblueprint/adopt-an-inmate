import Image from 'next/image';
import LogoImg from '@/assets/images/Adopt_An_Inmate_logo.png';

export default function Logo() {
  return (
    <div className="flex flex-col items-center gap-36">
      <div className="flex flex-row items-center gap-6 pt-14">
        <Image src={LogoImg} width={53} height={42} alt="Logo" />
        <p className="font-golos text-xl font-extrabold text-red-9">
          {' '}
          Adopt an Inmate
        </p>
      </div>
    </div>
  );
}
