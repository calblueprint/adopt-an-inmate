import Image from 'next/image';
import { cva } from 'class-variance-authority';
import LogoImg from '@/assets/images/Adopt_An_Inmate_logo.png';
import { cn } from '@/lib/utils';

type LogoVariants = 'default' | 'sidebar';

interface LogoProps {
  variant?: LogoVariants;
  className?: string;
}

const logoStyles = cva('flex items-center', {
  variants: {
    variant: {
      default: 'gap-6 pt-14 pb-3',
      sidebar: 'gap-2',
    },
  },
});

export default function Logo({ variant = 'default', className }: LogoProps) {
  return (
    <div className={logoStyles({ variant, className })}>
      <Image
        src={LogoImg}
        height={variant === 'sidebar' ? 28 : 42}
        alt="Adopt an Inmate"
        priority
      />
      <p
        className={cn(
          'font-golos text-xl font-extrabold text-red-9',
          variant === 'sidebar' && 'font-semibold',
        )}
      >
        Adopt an Inmate
      </p>
    </div>
  );
}
