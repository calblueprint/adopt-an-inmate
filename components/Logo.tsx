import Image from 'next/image';
import LogoImg from '@/assets/images/Adopt_An_Inmate_logo.png';

interface LogoProps {
  gap?: number;
  imageHeight?: number;
}

export default function Logo({ gap = 6, imageHeight = 42 }: LogoProps) {
  return (
    <div className={`flex flex-row items-center gap-${gap} pt-14 pb-3`}>
      <Image src={LogoImg} height={imageHeight} alt="Logo" priority />
      <p className="font-golos text-xl font-extrabold text-red-9">
        {' '}
        Adopt an Inmate
      </p>
    </div>
  );
}
