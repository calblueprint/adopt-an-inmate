import type { VariantProps } from 'class-variance-authority';
import { MouseEvent } from 'react';
import Link from 'next/link';
import { cva } from 'class-variance-authority';

const linkVariant = cva('', {
  variants: {
    variant: {
      default: 'text-blue-700 hover:underline',
      secondary: 'text-gray-9 underline',
      tertiary: 'text-gray-9 font-medium text-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type LinkVariantProp = VariantProps<typeof linkVariant>['variant'];

interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: LinkVariantProp;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

// export default function CustomLink({
//   className,
//   variant,
//   ...props
// }: React.ComponentProps<typeof Link> & { variant?: LinkVariantProp }) {
//   return <Link className={linkVariant({ variant, className })} {...props} />;
// }

export default function CustomLink({
  className,
  variant,
  href,
  onClick,
  children,
  ...props
}: CustomLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={linkVariant({ variant, className })}
      {...props}
    >
      {children}
    </Link>
  );
}
