import Image from 'next/image';
import LogoImg from '@/assets/images/Adopt_An_Inmate_logo.png';
import { cn } from '@/lib/utils';

interface LogoProps {
  compact?: boolean;
  className?: string;
}

export default function Logo({ compact = false, className }: LogoProps) {
  return (
    <div
      className={cn(
        'flex flex-row items-center',
        compact ? 'gap-2' : 'gap-6 pt-14 pb-3',
        className,
      )}
    >
      <Image
        src={LogoImg}
        height={compact ? 28 : 42}
        alt="Adopt an Inmate"
        priority
      />
      <p
        className={cn(
          'font-golos font-extrabold text-red-9',
          compact ? 'text-base' : 'text-xl',
        )}
      >
        Adopt an Inmate
      </p>
    </div>
  );
}
